import type { Message } from '@/lib/messaging';
import { broadcastToAllTabs, sendToActiveTab } from '@/lib/messaging';
import {
  getInspectionActive,
  setColorMode,
  setInspectionActive,
} from '@/lib/storage';
import { updateActionAppearance } from './action';

async function setAndBroadcast(active: boolean): Promise<void> {
  await setInspectionActive(active);
  await updateActionAppearance(active);
  broadcastToAllTabs({ type: 'INSPECTION_STATE', active });
}

async function toggleInspection(): Promise<boolean> {
  const active = await getInspectionActive();
  const next = !active;
  await setAndBroadcast(next);
  return next;
}

chrome.runtime.onInstalled.addListener(async () => {
  const active = await getInspectionActive();
  await updateActionAppearance(active);
});

chrome.action.onClicked.addListener(() => {
  void toggleInspection();
});

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === 'INSPECTION_SET') {
    void setAndBroadcast(message.active).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (message.type === 'INSPECTION_TOGGLE') {
    void toggleInspection();
    return true;
  }
  if (message.type === 'INSPECTION_GET') {
    void getInspectionActive().then((active) => {
      sendResponse({ type: 'INSPECTION_STATE', active } satisfies Message);
    });
    return true;
  }
  if (message.type === 'CLOSE_CARDS') {
    sendToActiveTab({ type: 'CLOSE_CARDS' });
    return true;
  }
  if (message.type === 'COLOR_MODE_SET') {
    void setColorMode(message.colorMode).then(() => sendResponse({ ok: true }));
    return true;
  }
  return false;
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-inspection') {
    await toggleInspection();
  }
  if (command === 'close-cards') {
    const active = await getInspectionActive();
    if (active) {
      sendToActiveTab({ type: 'CLOSE_CARDS' });
    }
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.inspectionActive) {
    const active = changes.inspectionActive.newValue as boolean;
    void updateActionAppearance(active);
    broadcastToAllTabs({ type: 'INSPECTION_STATE', active });
  }
  if (changes.colorMode) {
    const colorMode = changes.colorMode.newValue;
    broadcastToAllTabs({ type: 'COLOR_MODE_STATE', colorMode } satisfies Message);
  }
});

void getInspectionActive().then((active) => updateActionAppearance(active));
