import { useEffect, useState } from 'react';
import type { ColorMode } from '@/types/inspection';
import { getColorMode } from '@/lib/storage';

export function useThemeSync() {
  const [colorMode, setColorMode] = useState<ColorMode>('light');

  useEffect(() => {
    getColorMode().then(setColorMode);

    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area !== 'local' || !changes.colorMode) return;
      setColorMode(changes.colorMode.newValue as ColorMode);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return colorMode;
}
