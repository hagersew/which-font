import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config';

type BrowserTarget = 'chrome' | 'firefox' | 'safari';

const browser = (process.env.BROWSER ?? 'chrome') as BrowserTarget;
const outDir = browser === 'chrome' ? 'dist' : `dist-${browser}`;

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest,
      browser: browser === 'firefox' ? 'firefox' : 'chrome',
    }),
  ],
  build: {
    outDir,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
