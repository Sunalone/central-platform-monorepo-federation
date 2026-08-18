import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const cMapUrl = new URL(/* @vite-ignore */ "cmaps/", import.meta.url).href;

export const initPdf = async (pdfUrl: string) => {
  const pdfDoc = await pdfjsLib.getDocument({
    url: pdfUrl,
    cMapUrl,
    cMapPacked: true
  }).promise;
  return pdfDoc;
};

type PdfOptions = {
  pageNum: number;
  scale?: number;
};

export const renderPdf = async (
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  canvasBox: HTMLCanvasElement | null,
  options: PdfOptions
) => {
  if (!pdfDoc || !canvasBox) return;
  const { pageNum, scale = 1 } = options;
  const page = await pdfDoc.getPage(pageNum);
  const vp = page.getViewport({ scale });
  const canvas = canvasBox;
  const context = canvas.getContext("2d");
  if (!context) return;
  canvas.height = vp.height;
  canvas.width = vp.width;
  await page.render({ canvas, canvasContext: context, viewport: vp }).promise;
  return {
    viewport: vp
  };
};
