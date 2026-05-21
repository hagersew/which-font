# Which Font?

A Chrome extension (Manifest V3) that lets you inspect any DOM element and instantly view its typography and styling in a polished floating card.

## Features

- **Inspection mode** — click the toolbar icon or press `Alt+Shift+I`; icon changes when ON/OFF
- **Detail cards** — typography, colors, layout, element meta, and best-effort active CSS rules
- **Draggable & pinnable** cards with smart viewport positioning
- **Multiple cards** (up to 5) with persistent pins per origin
- **Copy** individual values or all styles as CSS
- **Export** inspection data as JSON
- **Inspection history** saved automatically (last 50)
- **System-aware** dark/light theme on cards
- **Keyboard shortcuts** — `Alt+Shift+I` toggle, `Esc` on page or `Alt+Shift+C` to close cards / exit

## Tech stack

- TypeScript, React 18, Chakra UI v2
- Vite + [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin)
- Shadow DOM isolation for content-script UI

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
node scripts/generate-icons.mjs   # if icons missing
npm run dev
```

Load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder (created by `npm run dev` or `npm run build`)

Use `npm run dev` for HMR during development; reload the extension when the manifest changes.

### Build

```bash
npm run build
```

Output is written to `dist/`.

### Package for distribution

```bash
npm run package
```

Creates `chrome-artifacts/which-font-chrome-{version}.zip` from `dist/`.

## Usage

1. Click the **Which Font?** toolbar icon to turn inspection **ON** (icon becomes indigo ring)
2. Hover elements to highlight them
3. Click an element to open its style card
4. Click the icon again to turn inspection **OFF** (icon becomes gray)
5. Drag the card header, pin it, copy values, or export JSON

## Permissions

| Permission   | Why                          |
| ------------ | ---------------------------- |
| `storage`    | Theme, history, pinned cards |
| `scripting`  | Tab messaging                |
| `activeTab`  | Active tab context           |
| `<all_urls>` | Inspect elements on any site |

## Project structure

```
src/
  background/     Service worker (toggle, shortcuts, badge)
  content/        Content script + inspector + Shadow DOM UI
  components/     InspectCard, PropertyRow, etc.
  background/     Service worker + toolbar icon toggle
  lib/            Storage, messaging, clipboard, export
  theme/          Chakra theme
```

## Browser support

Chrome, Brave, Edge, Arc (Chromium MV3).

## License

MIT — see [LICENSE](LICENSE).
