declare module 'eruda' {
  interface Eruda {
    init: (options?: Record<string, unknown>) => void;
    destroy: () => void;
    show: () => void;
    hide: () => void;
  }

  const eruda: Eruda;
  export default eruda;
}
