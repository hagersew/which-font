import { HOST_ID } from '@/lib/constants';

export type InspectorCallbacks = {
  onHover: (element: Element, rect: DOMRect) => void;
  onSelect: (element: Element, rect: DOMRect) => void;
  onHoverEnd: () => void;
};

let active = false;
let rafId: number | null = null;
let lastRectKey = '';
let callbacks: InspectorCallbacks | null = null;

function isOurHost(target: EventTarget | null): boolean {
  if (!(target instanceof Node)) return false;
  const host = document.getElementById(HOST_ID);
  return host?.contains(target) ?? false;
}

function rectKey(rect: DOMRect): string {
  return `${rect.x}|${rect.y}|${rect.width}|${rect.height}`;
}

function elementAtPoint(x: number, y: number): Element | null {
  const host = document.getElementById(HOST_ID);
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    if (host?.contains(el)) continue;
    if (el === document.documentElement || el === document.body) continue;
    return el;
  }
  return null;
}

function onPointerMove(e: PointerEvent): void {
  if (!active || !callbacks) return;
  if (isOurHost(e.target)) return;

  if (rafId != null) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const el = elementAtPoint(e.clientX, e.clientY);
    if (!el) {
      callbacks?.onHoverEnd();
      return;
    }
    const rect = el.getBoundingClientRect();
    const key = rectKey(rect);
    if (key === lastRectKey) return;
    lastRectKey = key;
    callbacks?.onHover(el, rect);
  });
}

function onClick(e: MouseEvent): void {
  if (!active || !callbacks) return;
  if (isOurHost(e.target)) return;

  e.preventDefault();
  e.stopPropagation();

  const el = elementAtPoint(e.clientX, e.clientY);
  if (!el) return;
  callbacks.onSelect(el, el.getBoundingClientRect());
}

function setCursor(enabled: boolean): void {
  document.documentElement.style.cursor = enabled ? 'crosshair' : '';
}

export function startInspector(cbs: InspectorCallbacks): void {
  if (active) return;
  active = true;
  callbacks = cbs;
  lastRectKey = '';
  setCursor(true);

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('click', onClick, true);
}

export function stopInspector(): void {
  if (!active) return;
  active = false;
  callbacks = null;
  lastRectKey = '';
  setCursor(false);

  if (rafId != null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('click', onClick, true);
}

export function isInspectorActive(): boolean {
  return active;
}
