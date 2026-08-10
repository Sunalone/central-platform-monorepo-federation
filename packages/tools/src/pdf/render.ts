import type { PdfDocument, RenderPdfPageOptions } from './types';

/** Renders a document page to a canvas with device-pixel-ratio aware sizing. */
export const renderPdfPage = async (
  document: PdfDocument,
  canvas: HTMLCanvasElement,
  pageNumber: number,
  options: RenderPdfPageOptions = {},
) => {
  const page = await document.getPage(pageNumber);
  if (options.signal?.aborted) return;

  const viewport = page.getViewport({ scale: options.scale ?? 1.35 });
  const outputScale = options.devicePixelRatio ?? window.devicePixelRatio ?? 1;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create a 2D canvas context.');

  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = `${Math.floor(viewport.width)}px`;
  canvas.style.height = `${Math.floor(viewport.height)}px`;

  const renderTask = page.render({
    canvas,
    canvasContext: context,
    viewport,
    transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
  });
  const cancelRender = () => renderTask.cancel();
  options.signal?.addEventListener('abort', cancelRender, { once: true });

  try {
    await renderTask.promise;
  } catch (error) {
    if (!options.signal?.aborted) throw error;
  } finally {
    options.signal?.removeEventListener('abort', cancelRender);
  }
};
