import { Box, useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import { HOST_ID, ROOT_ID } from '@/lib/constants';
import { HighlightOverlay } from '@/components/HighlightOverlay';
import { ClearSelectionButton } from '@/components/ClearSelectionButton';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { InspectCard } from '@/components/InspectCard';
import { useThemeSync } from '@/hooks/useTheme';
import { InspectionProvider, useInspection } from './context/InspectionContext';

function resolveColorMode(mode: string): 'light' | 'dark' {
  return mode === 'dark' ? 'dark' : 'light';
}

function syncHostStyles(mode: 'light' | 'dark'): void {
  const host = document.getElementById(HOST_ID);
  const root = document.getElementById(ROOT_ID);
  if (!host) return;
  const textColor = mode === 'dark' ? '#F7FAFC' : '#1A202C';
  host.style.setProperty('color', textColor, 'important');
  root?.style.setProperty('color-scheme', mode);
}

function ContentShell() {
  const {
    inspectionActive,
    hoverRect,
    cards,
    closeCard,
    closeAllUnpinned,
    pinCard,
    updateCardPosition,
  } = useInspection();
  const colorModePref = useThemeSync();
  const { colorMode, setColorMode } = useColorMode();
  const resolvedMode = resolveColorMode(colorMode);

  useEffect(() => {
    setColorMode(resolveColorMode(colorModePref));
  }, [colorModePref, setColorMode]);

  useEffect(() => {
    syncHostStyles(resolvedMode);
  }, [resolvedMode]);

  useEffect(() => {
    const listener = (msg: import('@/lib/messaging').Message) => {
      if (msg.type === 'COLOR_MODE_STATE') {
        setColorMode(resolveColorMode(msg.colorMode));
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [setColorMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        chrome.runtime.sendMessage({ type: 'CLOSE_CARDS' } satisfies import('@/lib/messaging').Message);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hasUnpinnedCards = cards.some((card) => !card.pinned);
  const showControls = inspectionActive || cards.length > 0;

  return (
    <Box
      data-theme={resolvedMode}
      position="fixed"
      inset={0}
      pointerEvents="none"
      zIndex={2147483645}
      fontFamily="body"
      color="text.primary"
    >
      <ThemeToggleButton
        visible={showControls}
        colorMode={resolvedMode}
        onChange={setColorMode}
      />
      <ClearSelectionButton
        visible={inspectionActive && hasUnpinnedCards}
        onClear={closeAllUnpinned}
      />
      <HighlightOverlay rect={hoverRect} visible={inspectionActive} />
      {cards.map((card) => (
        <Box key={card.id} pointerEvents="auto">
          <InspectCard
            card={card}
            onClose={closeCard}
            onPin={pinCard}
            onPositionChange={updateCardPosition}
          />
        </Box>
      ))}
    </Box>
  );
}

export function ContentApp() {
  return (
    <InspectionProvider>
      <ContentShell />
    </InspectionProvider>
  );
}
