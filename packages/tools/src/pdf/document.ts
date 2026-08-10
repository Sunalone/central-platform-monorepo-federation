import { getDocument } from 'pdfjs-dist';
import { configurePdfWorker } from './worker';
import type {
  LoadPdfDocumentOptions,
  PdfDocumentTask,
  PdfSource,
} from './types';

/** Loads a PDF document and configures its worker before starting the task. */
export const loadPdfDocument = (
  source: PdfSource,
  options: LoadPdfDocumentOptions = {},
): PdfDocumentTask => {
  const { workerUrl, moduleUrl, ...documentOptions } = options;
  configurePdfWorker({ workerUrl, moduleUrl });

  const sourceOptions =
    typeof source === 'string' || source instanceof URL ? { url: source } : { data: source };
  return getDocument({ ...documentOptions, ...sourceOptions });
};

export const destroyPdfDocument = async (loadingTask: PdfDocumentTask) => {
  await loadingTask.destroy();
};
