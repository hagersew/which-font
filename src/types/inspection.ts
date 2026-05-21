export interface TypographyStyles {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  textDecoration: string;
}

export interface ColorStyles {
  color: string;
  backgroundColor: string;
  opacity: string;
}

export interface LayoutStyles {
  margin: string;
  padding: string;
  borderRadius: string;
  width: string;
  height: string;
}

export interface ElementMeta {
  tagName: string;
  id: string;
  className: string;
  selectorPath: string;
}

export interface CssRuleMatch {
  selector: string;
  href: string;
  properties: string[];
}

export interface InspectionSnapshot {
  typography: TypographyStyles;
  colors: ColorStyles;
  layout: LayoutStyles;
  meta: ElementMeta;
  cssRules: CssRuleMatch[];
  computedRaw: Record<string, string>;
}

export interface InspectCardState {
  id: string;
  snapshot: InspectionSnapshot;
  position: { x: number; y: number };
  pinned: boolean;
  zIndex: number;
  anchorRect?: DOMRect;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  url: string;
  title: string;
  tag: string;
  classes: string;
  snapshot: InspectionSnapshot;
}

export interface PinnedCardPersisted {
  id: string;
  origin: string;
  selectorPath: string;
  position: { x: number; y: number };
  snapshot: InspectionSnapshot;
}

export type ColorMode = 'light' | 'dark' | 'system';

export interface StorageState {
  inspectionActive: boolean;
  colorMode: ColorMode;
  history: HistoryEntry[];
  pinnedCards: Record<string, PinnedCardPersisted[]>;
}
