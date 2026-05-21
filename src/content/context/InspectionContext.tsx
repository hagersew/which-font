import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  HistoryEntry,
  InspectCardState,
  PinnedCardPersisted,
} from '@/types/inspection';
import { MAX_CARDS } from '@/lib/constants';
import { computeCardPosition } from '@/hooks/useCardPosition';
import { extractInspection } from '@/content/styles/extractor';
import {
  getInspectionActive,
  getPinnedForOrigin,
  pushHistory,
  savePinnedForOrigin,
} from '@/lib/storage';
import {
  startInspector,
  stopInspector,
} from '@/content/inspector/controller';
import type { Message } from '@/lib/messaging';

interface InspectionContextValue {
  inspectionActive: boolean;
  hoverRect: DOMRect | null;
  cards: InspectCardState[];
  setInspectionActive: (active: boolean) => void;
  closeCard: (id: string) => void;
  closeTopCard: () => void;
  closeAllUnpinned: () => void;
  pinCard: (id: string, pinned: boolean) => void;
  updateCardPosition: (id: string, pos: { x: number; y: number }) => void;
}

const InspectionContext = createContext<InspectionContextValue | null>(null);

let cardIdCounter = 0;
function nextCardId(): string {
  return `card-${Date.now()}-${++cardIdCounter}`;
}

function snapshotFromPersisted(p: PinnedCardPersisted): InspectCardState {
  return {
    id: p.id,
    snapshot: p.snapshot,
    position: p.position,
    pinned: true,
    zIndex: 2147483640,
  };
}

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [inspectionActive, setInspectionActiveState] = useState(false);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [cards, setCards] = useState<InspectCardState[]>([]);
  const [zBase, setZBase] = useState(2147483640);

  const persistPinned = useCallback(async (nextCards: InspectCardState[]) => {
    const origin = window.location.origin;
    const pinned: PinnedCardPersisted[] = nextCards
      .filter((c) => c.pinned)
      .map((c) => ({
        id: c.id,
        origin,
        selectorPath: c.snapshot.meta.selectorPath,
        position: c.position,
        snapshot: c.snapshot,
      }));
    await savePinnedForOrigin(origin, pinned);
  }, []);

  const addCard = useCallback(
    (element: Element, rect: DOMRect) => {
      const snapshot = extractInspection(element);
      const position = computeCardPosition(rect);
      const id = nextCardId();
      const zIndex = zBase + 1;
      setZBase(zIndex);

      const entry: HistoryEntry = {
        id,
        timestamp: Date.now(),
        url: window.location.href,
        title: document.title,
        tag: snapshot.meta.tagName,
        classes: snapshot.meta.className,
        snapshot,
      };
      pushHistory(entry);
      chrome.runtime.sendMessage({ type: 'HISTORY_PUSH', entry } satisfies Message);

      setCards((prev) => {
        let next = [
          ...prev,
          {
            id,
            snapshot,
            position,
            pinned: false,
            zIndex,
            anchorRect: rect,
          },
        ];
        if (next.length > MAX_CARDS) {
          const unpinned = next.find((c) => !c.pinned);
          if (unpinned) next = next.filter((c) => c.id !== unpinned.id);
          else next = next.slice(1);
        }
        return next;
      });
    },
    [zBase],
  );

  const setInspectionActive = useCallback((active: boolean) => {
    setInspectionActiveState(active);
    if (!active) {
      stopInspector();
      setHoverRect(null);
    }
  }, []);

  useEffect(() => {
    getInspectionActive().then(setInspectionActiveState);
    getPinnedForOrigin(window.location.origin).then((pinned) => {
      if (pinned.length) {
        setCards(pinned.map(snapshotFromPersisted));
      }
    });
  }, []);

  useEffect(() => {
    if (!inspectionActive) {
      stopInspector();
      setHoverRect(null);
      return;
    }

    startInspector({
      onHover: (_el, rect) => setHoverRect(rect),
      onHoverEnd: () => setHoverRect(null),
      onSelect: (el, rect) => addCard(el, rect),
    });

    return () => stopInspector();
  }, [inspectionActive, addCard]);

  useEffect(() => {
    const listener = (msg: Message) => {
      if (msg.type === 'INSPECTION_SET' || msg.type === 'INSPECTION_STATE') {
        setInspectionActive(msg.active);
      }
      if (msg.type === 'CLOSE_CARDS') {
        setCards((prev) => {
          const unpinned = prev.filter((c) => !c.pinned);
          if (unpinned.length > 0) {
            const top = unpinned[unpinned.length - 1];
            const next = prev.filter((c) => c.id !== top.id);
            void persistPinned(next);
            return next;
          }
          setInspectionActiveState(false);
          stopInspector();
          setHoverRect(null);
          chrome.runtime.sendMessage({
            type: 'INSPECTION_SET',
            active: false,
          } satisfies Message);
          return prev;
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [setInspectionActive, persistPinned]);

  const closeCard = useCallback(
    (id: string) => {
      setCards((prev) => {
        const next = prev.filter((c) => c.id !== id);
        void persistPinned(next);
        return next;
      });
    },
    [persistPinned],
  );

  const closeTopCard = useCallback(() => {
    setCards((prev) => {
      const unpinned = prev.filter((c) => !c.pinned);
      if (unpinned.length === 0) return prev;
      const top = unpinned[unpinned.length - 1];
      const next = prev.filter((c) => c.id !== top.id);
      void persistPinned(next);
      return next;
    });
  }, [persistPinned]);

  const closeAllUnpinned = useCallback(() => {
    setCards((prev) => {
      const next = prev.filter((c) => c.pinned);
      void persistPinned(next);
      return next;
    });
  }, [persistPinned]);

  const pinCard = useCallback(
    (id: string, pinned: boolean) => {
      setCards((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, pinned } : c));
        void persistPinned(next);
        return next;
      });
    },
    [persistPinned],
  );

  const updateCardPosition = useCallback((id: string, pos: { x: number; y: number }) => {
    setCards((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, position: pos } : c));
      const card = next.find((c) => c.id === id);
      if (card?.pinned) void persistPinned(next);
      return next;
    });
  }, [persistPinned]);

  const value = useMemo(
    () => ({
      inspectionActive,
      hoverRect,
      cards,
      setInspectionActive,
      closeCard,
      closeTopCard,
      closeAllUnpinned,
      pinCard,
      updateCardPosition,
    }),
    [
      inspectionActive,
      hoverRect,
      cards,
      setInspectionActive,
      closeCard,
      closeTopCard,
      closeAllUnpinned,
      pinCard,
      updateCardPosition,
    ],
  );

  return (
    <InspectionContext.Provider value={value}>
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection(): InspectionContextValue {
  const ctx = useContext(InspectionContext);
  if (!ctx) throw new Error('useInspection must be used within InspectionProvider');
  return ctx;
}
