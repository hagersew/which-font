import type {
  ColorMode,
  HistoryEntry,
  PinnedCardPersisted,
  StorageState,
} from '@/types/inspection';
import { MAX_HISTORY } from './constants';

const DEFAULT_STATE: StorageState = {
  inspectionActive: false,
  colorMode: 'light',
  history: [],
  pinnedCards: {},
};

export async function getStorage(): Promise<StorageState> {
  const result = await chrome.storage.local.get(Object.keys(DEFAULT_STATE));
  return { ...DEFAULT_STATE, ...result } as StorageState;
}

export async function setInspectionActive(active: boolean): Promise<void> {
  await chrome.storage.local.set({ inspectionActive: active });
}

export async function getInspectionActive(): Promise<boolean> {
  const { inspectionActive } = await getStorage();
  return inspectionActive;
}

export async function setColorMode(colorMode: ColorMode): Promise<void> {
  await chrome.storage.local.set({ colorMode });
}

export async function getColorMode(): Promise<ColorMode> {
  const { colorMode } = await getStorage();
  if (colorMode === 'dark') return 'dark';
  return 'light';
}

export async function pushHistory(entry: HistoryEntry): Promise<void> {
  const { history } = await getStorage();
  const next = [entry, ...history].slice(0, MAX_HISTORY);
  await chrome.storage.local.set({ history: next });
}

export async function clearHistory(): Promise<void> {
  await chrome.storage.local.set({ history: [] });
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const { history } = await getStorage();
  return history;
}

export async function getPinnedForOrigin(
  origin: string,
): Promise<PinnedCardPersisted[]> {
  const { pinnedCards } = await getStorage();
  return pinnedCards[origin] ?? [];
}

export async function savePinnedForOrigin(
  origin: string,
  cards: PinnedCardPersisted[],
): Promise<void> {
  const { pinnedCards } = await getStorage();
  pinnedCards[origin] = cards;
  await chrome.storage.local.set({ pinnedCards });
}

export async function clearAllData(): Promise<void> {
  await chrome.storage.local.clear();
  await chrome.storage.local.set(DEFAULT_STATE);
}
