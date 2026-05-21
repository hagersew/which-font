import { CLIPBOARD_CLASS } from '@/lib/constants';

/** Copy from content script / shadow DOM — prefers page document fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* clipboard API often blocked in content scripts */
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.className = CLIPBOARD_CLASS;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText =
      'position:fixed!important;top:0!important;left:0!important;width:2px!important;height:2px!important;padding:0!important;border:none!important;outline:none!important;box-shadow:none!important;background:transparent!important;margin:0!important;opacity:0!important;pointer-events:none!important;';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
