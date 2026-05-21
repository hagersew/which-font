import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ColorModeContext,
  CSSPolyfill,
  EnvironmentProvider,
  GlobalStyle,
  ThemeProvider,
  ToastOptionProvider,
  ToastProvider,
  type ColorMode as ChakraColorMode,
} from '@chakra-ui/react';
import {
  HOST_CLASS,
  HOST_ID,
  ROOT_CLASS,
  ROOT_ID,
} from '@/lib/constants';
import { createPortalDocument } from '@/lib/portal-document';
import { getColorMode } from '@/lib/storage';
import { theme } from '@/theme';

interface WhichFontChakraProviderProps {
  children: ReactNode;
  portalContainer: HTMLElement;
}

const CSS_VARS_ROOT = `#${ROOT_ID}.${ROOT_CLASS}`;

export function WhichFontChakraProvider({
  children,
  portalContainer,
}: WhichFontChakraProviderProps) {
  const [colorMode, setColorModeState] = useState<ChakraColorMode>('light');

  useEffect(() => {
    void getColorMode().then((mode) =>
      setColorModeState(mode === 'dark' ? 'dark' : 'light'),
    );
  }, []);

  const setColorMode = useCallback((value: ChakraColorMode | 'system') => {
    const resolved: ChakraColorMode = value === 'dark' ? 'dark' : 'light';
    setColorModeState(resolved);
  }, []);

  const colorModeContext = useMemo(
    () => ({
      colorMode,
      toggleColorMode: () =>
        setColorMode(colorMode === 'dark' ? 'light' : 'dark'),
      setColorMode,
    }),
    [colorMode, setColorMode],
  );

  const environment = useMemo(
    () => ({
      getDocument: () => createPortalDocument(portalContainer),
      getWindow: () => window,
    }),
    [portalContainer],
  );

  return (
    <ThemeProvider theme={theme} cssVarsRoot={CSS_VARS_ROOT}>
      <ColorModeContext.Provider value={colorModeContext}>
        <EnvironmentProvider environment={environment} disabled>
          <CSSPolyfill />
          <GlobalStyle />
          <ToastOptionProvider value={undefined}>
            {children}
          </ToastOptionProvider>
          <ToastProvider />
        </EnvironmentProvider>
      </ColorModeContext.Provider>
    </ThemeProvider>
  );
}

/** Remove legacy Chakra artifacts that may have been applied to the host page. */
export function cleanupPageStyleArtifacts(): void {
  document.body.classList.remove('chakra-ui-light', 'chakra-ui-dark');
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = '';

  document.querySelectorAll('.chakra-portal').forEach((el) => {
    if (!el.closest(`#${HOST_ID}.${HOST_CLASS}`)) {
      el.remove();
    }
  });
}
