import { describe, expect, it, vi } from 'vitest';
import { createSignatureCanvas } from './canvas';

// Keep the canvas mock framework-independent while exposing every drawing side effect.
// Canvas Mock 不依赖任何前端框架，同时保留所有绘制副作用供断言使用。
const createCanvasMock = () => {
  const context = {
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
    clearRect: vi.fn(),
    lineWidth: 0,
    strokeStyle: '',
    lineCap: 'butt' as CanvasLineCap,
    lineJoin: 'miter' as CanvasLineJoin,
  };
  const canvas = {
    width: 600,
    height: 300,
    getContext: vi.fn(() => context),
    getBoundingClientRect: vi.fn(() => ({
      left: 10,
      top: 20,
      width: 300,
      height: 150,
    })),
    toDataURL: vi.fn(() => 'data:image/png;base64,signature'),
  };

  return {
    canvas: canvas as unknown as HTMLCanvasElement,
    context,
  };
};

describe('createSignatureCanvas', () => {
  it('applies drawing options and converts pointer coordinates to canvas coordinates', () => {
    const { canvas, context } = createCanvasMock();
    const signature = createSignatureCanvas(canvas, {
      lineWidth: 4,
      strokeStyle: '#409EFF',
      lineCap: 'square',
      lineJoin: 'bevel',
    });

    signature.startDraw({ clientX: 40, clientY: 50 });
    signature.draw({ clientX: 70, clientY: 80 });
    signature.endDraw();

    // The backing canvas is twice the displayed size, so pointer coordinates scale by two.
    // Canvas 实际尺寸是显示尺寸的两倍，因此指针坐标也需要放大两倍。
    expect(context.beginPath).toHaveBeenCalledOnce();
    expect(context.moveTo).toHaveBeenCalledWith(60, 60);
    expect(context.lineTo).toHaveBeenCalledWith(120, 120);
    expect(context.stroke).toHaveBeenCalledOnce();
    expect(context.closePath).toHaveBeenCalledOnce();
    expect(context).toMatchObject({
      lineWidth: 4,
      strokeStyle: '#409EFF',
      lineCap: 'square',
      lineJoin: 'bevel',
    });
  });

  it('does not draw before a stroke has started or after it has ended', () => {
    const { canvas, context } = createCanvasMock();
    const signature = createSignatureCanvas(canvas);

    signature.draw({ clientX: 20, clientY: 30 });
    signature.startDraw({ clientX: 20, clientY: 30 });
    signature.endDraw();
    signature.draw({ clientX: 30, clientY: 40 });

    expect(context.lineTo).not.toHaveBeenCalled();
    expect(context.stroke).not.toHaveBeenCalled();
  });

  it('clears and exports the canvas', () => {
    const { canvas, context } = createCanvasMock();
    const signature = createSignatureCanvas(canvas);

    signature.clear();
    const dataUrl = signature.getBase64DataUrl('image/jpeg', 0.8);

    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 600, 300);
    expect(canvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
    expect(dataUrl).toBe('data:image/png;base64,signature');
  });

  it('throws when the canvas cannot provide a 2D context', () => {
    const canvas = {
      getContext: vi.fn(() => null),
    } as unknown as HTMLCanvasElement;

    expect(() => createSignatureCanvas(canvas)).toThrow(
      'Unable to create a 2D canvas context.',
    );
  });
});
