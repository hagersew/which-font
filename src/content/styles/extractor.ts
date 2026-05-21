import type {
  CssRuleMatch,
  InspectionSnapshot,
} from '@/types/inspection';

function getSelectorPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    let part = current.tagName.toLowerCase();
    if (current.id) {
      part += `#${current.id}`;
      parts.unshift(part);
      break;
    }
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c) => c.tagName === current!.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        part += `:nth-of-type(${index})`;
      }
    }
    parts.unshift(part);
    current = current.parentElement;
  }
  return parts.join(' > ');
}

function collectCssRules(element: Element): CssRuleMatch[] {
  const matches: CssRuleMatch[] = [];
  const seen = new Set<string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      matches.push({
        selector: '(cross-origin stylesheet)',
        href: sheet.href ?? 'blocked',
        properties: [],
      });
      continue;
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue;
      try {
        if (!element.matches(rule.selectorText)) continue;
        const key = `${sheet.href ?? 'inline'}::${rule.selectorText}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const props = Array.from(rule.style).filter((p) =>
          rule.style.getPropertyValue(p),
        );
        matches.push({
          selector: rule.selectorText,
          href: sheet.href ?? 'inline',
          properties: props.slice(0, 12),
        });
      } catch {
        /* invalid selector for this element */
      }
    }
  }

  return matches.slice(0, 8);
}

export function extractInspection(element: Element): InspectionSnapshot {
  const computed = getComputedStyle(element);
  const meta = {
    tagName: element.tagName.toLowerCase(),
    id: element.id || '—',
    className: element.className?.toString() || '—',
    selectorPath: getSelectorPath(element),
  };

  const typography = {
    fontFamily: computed.fontFamily,
    fontSize: computed.fontSize,
    fontWeight: computed.fontWeight,
    fontStyle: computed.fontStyle,
    lineHeight: computed.lineHeight,
    letterSpacing: computed.letterSpacing,
    textTransform: computed.textTransform,
    textDecoration: computed.textDecorationLine || computed.textDecoration,
  };

  const colors = {
    color: computed.color,
    backgroundColor: computed.backgroundColor,
    opacity: computed.opacity,
  };

  const layout = {
    margin: `${computed.marginTop} ${computed.marginRight} ${computed.marginBottom} ${computed.marginLeft}`,
    padding: `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`,
    borderRadius: computed.borderRadius,
    width: computed.width,
    height: computed.height,
  };

  const computedRaw: Record<string, string> = {};
  const keys = [
    ...Object.keys(typography),
    ...Object.keys(colors),
    ...Object.keys(layout),
  ] as (keyof typeof typography & keyof typeof colors & keyof typeof layout)[];
  for (const k of keys) {
    const val =
      typography[k as keyof typeof typography] ??
      colors[k as keyof typeof colors] ??
      layout[k as keyof typeof layout];
    if (val) computedRaw[k] = String(val);
  }

  return {
    typography,
    colors,
    layout,
    meta,
    cssRules: collectCssRules(element),
    computedRaw,
  };
}
