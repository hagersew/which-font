import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { HOST_ID, ROOT_ID } from '@/lib/constants';
import { theme } from '@/theme';
import { ContentApp } from './ContentApp';

function isolateShadowHost(host: HTMLElement): void {
  host.style.all = 'initial';
  host.style.display = 'block';
  host.style.setProperty('color', '#1A202C', 'important');
  host.style.setProperty('-webkit-text-fill-color', 'currentColor', 'important');
  host.style.setProperty('font-size', '16px', 'important');
  host.style.setProperty('line-height', '1.5', 'important');
  host.style.setProperty(
    'font-family',
    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'important',
  );
}

function mount(): void {
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement('div');
  host.id = HOST_ID;
  isolateShadowHost(host);
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  const mountPoint = document.createElement('div');
  mountPoint.id = ROOT_ID;
  shadow.appendChild(mountPoint);

  const emotionCache = createCache({
    key: 'which-font',
    container: shadow,
  });

  const root = createRoot(mountPoint);
  root.render(
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <ChakraProvider theme={theme} resetCSS>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <ContentApp />
        </ChakraProvider>
      </CacheProvider>
    </StrictMode>,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
