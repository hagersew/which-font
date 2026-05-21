import { CARD_MAX_HEIGHT, CARD_OFFSET, CARD_WIDTH } from '@/lib/constants';

export function computeCardPosition(
  anchorRect: DOMRect,
  cardHeight = CARD_MAX_HEIGHT,
): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = CARD_WIDTH;
  const h = cardHeight;

  let x = anchorRect.right + CARD_OFFSET;
  let y = anchorRect.top;

  if (x + w > vw - 8) {
    x = anchorRect.left - w - CARD_OFFSET;
  }
  if (x < 8) {
    x = Math.max(8, anchorRect.left);
  }
  if (y + h > vh - 8) {
    y = anchorRect.bottom - h;
  }
  if (y < 8) {
    y = 8;
  }

  return {
    x: Math.min(Math.max(8, x), vw - w - 8),
    y: Math.min(Math.max(8, y), vh - h - 8),
  };
}

export function clampPosition(
  pos: { x: number; y: number },
  cardHeight = CARD_MAX_HEIGHT,
): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.min(Math.max(8, pos.x), vw - CARD_WIDTH - 8),
    y: Math.min(Math.max(8, pos.y), vh - cardHeight - 8),
  };
}
