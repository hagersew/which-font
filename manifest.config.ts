import { defineManifest } from '@crxjs/vite-plugin';

export type BrowserTarget = 'chrome' | 'firefox' | 'safari';

const FIREFOX_EXTENSION_ID = 'which-font@hagersew.com';

function getBrowserTarget(): BrowserTarget {
  const browser = process.env.BROWSER ?? 'chrome';
  if (browser === 'firefox' || browser === 'safari') return browser;
  return 'chrome';
}

export default defineManifest(() => {
  const browser = getBrowserTarget();

  return {
    manifest_version: 3,
    name: 'Which Font',
    version: '0.0.1',
    description:
      'Inspect any DOM element and instantly view its typography and styling details.',
    permissions: ['storage', 'scripting', 'activeTab'],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Which Font — Click to turn on inspection',
      default_icon: {
        '16': 'public/icons/off/icon16.png',
        '32': 'public/icons/off/icon32.png',
        '48': 'public/icons/off/icon48.png',
      },
    },
    background:
      browser === 'firefox'
        ? {
          scripts: ['src/background/service-worker.ts'],
          type: 'module',
        }
        : {
          service_worker: 'src/background/service-worker.ts',
          type: 'module',
        },
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['src/content/main.tsx'],
        run_at: 'document_idle',
      },
    ],
    commands: {
      'toggle-inspection': {
        suggested_key: { default: 'Alt+Shift+I', mac: 'Alt+Shift+I' },
        description: 'Toggle inspection mode',
      },
      // Escape is not allowed in chrome.commands — handled in the content script instead.
      'close-cards': {
        suggested_key: { default: 'Alt+Shift+C', mac: 'Alt+Shift+C' },
        description: 'Close top card or exit inspection',
      },
    },
    icons: {
      '16': 'public/icons/icon16.png',
      '32': 'public/icons/icon32.png',
      '48': 'public/icons/icon48.png',
      '128': 'public/icons/icon128.png',
    },
    web_accessible_resources: [
      {
        resources: [
          'public/icons/on/icon16.png',
          'public/icons/on/icon32.png',
          'public/icons/on/icon48.png',
        ],
        matches: ['<all_urls>'],
      },
    ],
    ...(browser === 'firefox'
      ? {
        browser_specific_settings: {
          gecko: {
            id: FIREFOX_EXTENSION_ID,
            strict_min_version: '109.0',
            data_collection_permissions: {
              required: ['none' as const],
            },
          },
        },
      }
      : {}),
  };
});
