import type { HistoryEntry } from '@/types/inspection';

export type Message =
  | { type: 'INSPECTION_SET'; active: boolean }
  | { type: 'INSPECTION_GET' }
  | { type: 'INSPECTION_STATE'; active: boolean }
  | { type: 'INSPECTION_TOGGLE' }
  | { type: 'HISTORY_PUSH'; entry: HistoryEntry }
  | { type: 'CLOSE_CARDS' }
  | { type: 'COLOR_MODE_SET'; colorMode: 'light' | 'dark' | 'system' }
  | { type: 'COLOR_MODE_STATE'; colorMode: 'light' | 'dark' | 'system' };

export function sendToTab(tabId: number, message: Message): Promise<unknown> {
  return chrome.tabs.sendMessage(tabId, message).catch(() => undefined);
}

export function sendToActiveTab(message: Message): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab?.id != null) sendToTab(tab.id, message);
  });
}

export function broadcastToAllTabs(message: Message): void {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id != null) sendToTab(tab.id, message);
    }
  });
}
