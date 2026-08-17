import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const cMapUrl = new URL("cmaps/", import.meta.url).href;

export const initPdf = async (pdfUrl: string) => {
  const pdfDoc = await pdfjsLib.getDocument({
    url: pdfUrl,
    cMapUrl: cMapUrl + "/",
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
  const rotate = page.rotate;
  canvas.height = vp.height;
  canvas.width = vp.width;
  await page.render({ canvasContext: context, viewport: vp, rotate }).promise;
  return {
    viewport: vp
  };
};
