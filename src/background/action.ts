const ICON_SIZES = [16, 32, 48] as const;

function iconPaths(state: 'on' | 'off'): Record<number, string> {
  return Object.fromEntries(
    ICON_SIZES.map((size) => [
      size,
      chrome.runtime.getURL(`public/icons/${state}/icon${size}.png`),
    ]),
  );
}

export async function updateActionAppearance(active: boolean): Promise<void> {
  const state = active ? 'on' : 'off';
  await chrome.action.setIcon({ path: iconPaths(state) });
  await chrome.action.setTitle({
    title: active
      ? 'Which Font — Inspection ON (click to turn off)'
      : 'Which Font — Inspection OFF (click to turn on)',
  });
  await chrome.action.setBadgeText({ text: '' });
}
