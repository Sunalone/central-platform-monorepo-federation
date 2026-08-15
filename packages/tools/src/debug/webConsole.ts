export interface WebConsoleOptions {
  /** URL query parameter used to enable or disable the console. */
  queryParam?: string;
  /** localStorage key used to persist the current browser's setting. */
  storageKey?: string;
  /** Removes the control parameter after applying it. Defaults to true. */
  clearQueryParam?: boolean;
}

export interface WebConsoleController {
  enabled: boolean;
  destroy: () => void;
}

const ENABLED_VALUES = new Set(['1', 'true', 'on']);
const DISABLED_VALUES = new Set(['0', 'false', 'off']);

const updateStoredSetting = (storageKey: string, value: string | null) => {
  try {
    if (value === '1') globalThis.localStorage?.setItem(storageKey, value);
    else if (value === '0') globalThis.localStorage?.removeItem(storageKey);
  } catch {
    // Storage can be unavailable in private browsing or restricted webviews.
  }
};

const readStoredSetting = (storageKey: string) => {
  try {
    return globalThis.localStorage?.getItem(storageKey) === '1';
  } catch {
    return false;
  }
};

const clearControlParameter = (url: URL, queryParam: string) => {
  url.searchParams.delete(queryParam);
  globalThis.history?.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
};

/**
 * Enables an Eruda web console on demand without coupling the utility to a UI framework.
 * Append `?debug=1` to enable it for the current browser and `?debug=0` to disable it.
 */
export const initWebConsole = async (
  options: WebConsoleOptions = {},
): Promise<WebConsoleController> => {
  if (typeof window === 'undefined') return { enabled: false, destroy: () => undefined };

  const queryParam = options.queryParam ?? 'debug';
  const storageKey = options.storageKey ?? 'central-platform:web-console';
  const url = new URL(window.location.href);
  const queryValue = url.searchParams.get(queryParam)?.toLowerCase() ?? null;

  if (queryValue && ENABLED_VALUES.has(queryValue)) updateStoredSetting(storageKey, '1');
  if (queryValue && DISABLED_VALUES.has(queryValue)) updateStoredSetting(storageKey, '0');
  if (queryValue && options.clearQueryParam !== false) clearControlParameter(url, queryParam);

  const enabled = queryValue
    ? ENABLED_VALUES.has(queryValue)
    : readStoredSetting(storageKey);

  if (!enabled) return { enabled: false, destroy: () => undefined };

  const { default: eruda } = await import('eruda');
  eruda.init();

  return {
    enabled: true,
    destroy: () => {
      eruda.destroy();
      updateStoredSetting(storageKey, '0');
    },
  };
};
