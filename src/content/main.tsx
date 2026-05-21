import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import {
  HOST_CLASS,
  HOST_ID,
  PORTAL_CLASS,
  PORTAL_ID,
  ROOT_CLASS,
  ROOT_ID,
} from '@/lib/constants';
import { getInspectionActive } from '@/lib/storage';
import type { Message } from '@/lib/messaging';
import {
  cleanupPageStyleArtifacts,
  WhichFontChakraProvider,
} from '@/providers/WhichFontChakraProvider';
import { stopInspector } from './inspector/controller';
import { ContentApp } from './ContentApp';

let reactRoot: Root | null = null;

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
  cleanupPageStyleArtifacts();

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.className = HOST_CLASS;
  isolateShadowHost(host);
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const portalRoot = document.createElement('div');
  portalRoot.id = PORTAL_ID;
  portalRoot.className = PORTAL_CLASS;
  shadow.appendChild(portalRoot);

  const mountPoint = document.createElement('div');
  mountPoint.id = ROOT_ID;
  mountPoint.className = ROOT_CLASS;
  shadow.appendChild(mountPoint);

  const emotionCache = createCache({
    key: 'which-font',
    container: shadow,
  });

  reactRoot = createRoot(mountPoint);
  reactRoot.render(
    <StrictMode>
      <CacheProvider value={emotionCache}>
        <WhichFontChakraProvider portalContainer={portalRoot}>
          <ContentApp />
        </WhichFontChakraProvider>
      </CacheProvider>
    </StrictMode>,
  );
}

function unmount(): void {
  stopInspector();
  reactRoot?.unmount();
  reactRoot = null;
  document.getElementById(HOST_ID)?.remove();
  cleanupPageStyleArtifacts();
}

function applyInspectionState(active: boolean): void {
  if (active) mount();
  else unmount();
}

function init(): void {
  chrome.runtime.onMessage.addListener((msg: Message) => {
    if (msg.type === 'INSPECTION_STATE') {
      applyInspectionState(msg.active);
    }
  });

  void getInspectionActive().then(applyInspectionState);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
