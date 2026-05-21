/** Route Chakra portals (e.g. toasts) into the shadow tree instead of document.body. */
export function createPortalDocument(container: HTMLElement): Document {
  return new Proxy(document, {
    get(target, prop, receiver) {
      if (prop === 'body') {
        return container as unknown as HTMLBodyElement;
      }
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'function') {
        return (...args: unknown[]) =>
          (value as (...a: unknown[]) => unknown).apply(target, args);
      }
      return value;
    },
  }) as Document;
}
