import { GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { ConfigurePdfWorkerOptions } from './types';

/** Resolves a worker URL against the remote app origin for Module Federation. */
export const resolvePdfWorkerUrl = (
  workerUrl = pdfWorkerUrl,
  moduleUrl?: string,
) => {
  if (/^(data:|blob:|https?:)/.test(workerUrl)) return workerUrl;
  const origin = moduleUrl ? new URL(moduleUrl).origin : globalThis.location?.origin;
  return origin ? `${origin}${workerUrl.startsWith('/') ? workerUrl : `/${workerUrl}`}` : workerUrl;
};

export const configurePdfWorker = (options: ConfigurePdfWorkerOptions = {}) => {
  const resolvedWorkerUrl = resolvePdfWorkerUrl(options.workerUrl, options.moduleUrl);
  GlobalWorkerOptions.workerSrc = resolvedWorkerUrl;
  return resolvedWorkerUrl;
};
