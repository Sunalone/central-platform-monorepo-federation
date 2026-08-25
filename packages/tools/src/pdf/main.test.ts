import { beforeEach, describe, expect, it, vi } from 'vitest';

// Hoisted mocks are available before Vitest evaluates the statically imported PDF module.
// 提升后的 Mock 会在 Vitest 加载静态导入的 PDF 模块前准备完成。
const pdfMocks = vi.hoisted(() => ({
  getDocument: vi.fn(),
  workerOptions: { workerSrc: '' },
}));

vi.mock('pdfjs-dist', () => ({
  getDocument: pdfMocks.getDocument,
  GlobalWorkerOptions: pdfMocks.workerOptions,
}));

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  // Simulate the URL that Vite generates for the PDF.js worker asset.
  // 模拟 Vite 为 PDF.js Worker 静态资源生成的访问地址。
  default: '/assets/pdf.worker.mjs',
}));

import { initPdf, renderPdf } from './main';

describe('PDF tools', () => {
  beforeEach(() => {
    pdfMocks.getDocument.mockReset();
  });

  it('configures the worker and loads a PDF with packed CMaps', async () => {
    const document = { numPages: 2 };
    pdfMocks.getDocument.mockReturnValue({ promise: Promise.resolve(document) });

    await expect(initPdf('/protocols/agreement.pdf')).resolves.toBe(document);
    expect(pdfMocks.workerOptions.workerSrc).toBe('/assets/pdf.worker.mjs');
    expect(pdfMocks.getDocument).toHaveBeenCalledWith({
      url: '/protocols/agreement.pdf',
      cMapUrl: expect.stringMatching(/cmaps\/$/),
      cMapPacked: true,
    });
  });

  it('renders the requested page and updates the canvas dimensions', async () => {
    const renderPromise = Promise.resolve();
    const render = vi.fn(() => ({ promise: renderPromise }));
    const viewport = { width: 720, height: 960 };
    const getViewport = vi.fn(() => viewport);
    const getPage = vi.fn(async () => ({ getViewport, render }));
    const pdfDocument = { getPage };
    const context = {} as CanvasRenderingContext2D;
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
    } as unknown as HTMLCanvasElement;

    const result = await renderPdf(
      pdfDocument as never,
      canvas,
      { pageNum: 3, scale: 1.5 },
    );

    // Canvas dimensions must follow the viewport before PDF.js starts painting.
    // PDF.js 开始绘制前，Canvas 尺寸必须与当前页面视口保持一致。
    expect(getPage).toHaveBeenCalledWith(3);
    expect(getViewport).toHaveBeenCalledWith({ scale: 1.5 });
    expect(canvas.width).toBe(720);
    expect(canvas.height).toBe(960);
    expect(render).toHaveBeenCalledWith({ canvas, canvasContext: context, viewport });
    expect(result).toEqual({ viewport });
  });

  it('skips rendering when the canvas or its context is unavailable', async () => {
    const getViewport = vi.fn(() => ({ width: 100, height: 100 }));
    const render = vi.fn();
    const getPage = vi.fn(async () => ({ getViewport, render }));
    const pdfDocument = { getPage };
    const canvas = {
      getContext: vi.fn(() => null),
    } as unknown as HTMLCanvasElement;

    await expect(renderPdf(pdfDocument as never, null, { pageNum: 1 })).resolves.toBeUndefined();
    await expect(renderPdf(pdfDocument as never, canvas, { pageNum: 1 })).resolves.toBeUndefined();
    expect(getPage).toHaveBeenCalledOnce();
    expect(getViewport).toHaveBeenCalledWith({ scale: 1 });
    expect(render).not.toHaveBeenCalled();
  });
});
