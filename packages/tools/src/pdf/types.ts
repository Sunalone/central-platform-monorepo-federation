import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import type { DocumentInitParameters } from 'pdfjs-dist/types/src/display/api';

export type { PDFDocumentLoadingTask, PDFDocumentProxy };

export type PdfSource = string | URL | ArrayBuffer | Uint8Array;

export interface ConfigurePdfWorkerOptions {
  workerUrl?: string;
  moduleUrl?: string;
}

export interface LoadPdfDocumentOptions extends Omit<DocumentInitParameters, 'data' | 'url'> {
  workerUrl?: string;
  moduleUrl?: string;
}

export interface RenderPdfPageOptions {
  scale?: number;
  devicePixelRatio?: number;
  signal?: AbortSignal;
}

export type PdfDocumentTask = PDFDocumentLoadingTask;
export type PdfDocument = PDFDocumentProxy;
