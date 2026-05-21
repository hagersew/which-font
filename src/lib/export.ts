import type { InspectionSnapshot } from '@/types/inspection';

export function snapshotToCss(snapshot: InspectionSnapshot): string {
  const { typography, colors, layout, meta } = snapshot;
  return `/* ${meta.tagName}${meta.id ? `#${meta.id}` : ''}${meta.className ? `.${meta.className.split(' ').join('.')}` : ''} */
font-family: ${typography.fontFamily};
font-size: ${typography.fontSize};
font-weight: ${typography.fontWeight};
font-style: ${typography.fontStyle};
line-height: ${typography.lineHeight};
letter-spacing: ${typography.letterSpacing};
text-transform: ${typography.textTransform};
text-decoration: ${typography.textDecoration};
color: ${colors.color};
background-color: ${colors.backgroundColor};
opacity: ${colors.opacity};
margin: ${layout.margin};
padding: ${layout.padding};
border-radius: ${layout.borderRadius};
width: ${layout.width};
height: ${layout.height};`;
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
