import iconOff16 from '../../public/icons/off/icon16.png';
import iconOff32 from '../../public/icons/off/icon32.png';
import iconOff48 from '../../public/icons/off/icon48.png';
import iconOn16 from '../../public/icons/on/icon16.png';
import iconOn32 from '../../public/icons/on/icon32.png';
import iconOn48 from '../../public/icons/on/icon48.png';

const ICON_PATHS = {
  on: { 16: iconOn16, 32: iconOn32, 48: iconOn48 },
  off: { 16: iconOff16, 32: iconOff32, 48: iconOff48 },
} as const;

export async function updateActionAppearance(active: boolean): Promise<void> {
  const state = active ? 'on' : 'off';
  await chrome.action.setIcon({ path: ICON_PATHS[state] });
  await chrome.action.setTitle({
    title: active
      ? 'Which Font? — Inspection ON (click to turn off)'
      : 'Which Font? — Inspection OFF (click to turn on)',
  });
  await chrome.action.setBadgeText({ text: '' });
}
