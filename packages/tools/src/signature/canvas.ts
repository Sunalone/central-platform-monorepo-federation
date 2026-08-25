import type {
  SignatureController,
  SignatureOptions,
  SignaturePointerEvent,
} from './types';

const getCanvasPoint = (canvas: HTMLCanvasElement, event: SignaturePointerEvent) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width ? canvas.width / rect.width : 1;
  const scaleY = rect.height ? canvas.height / rect.height : 1;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};

/**
 * Creates a framework-agnostic signature controller for a canvas element.
 * 为 Canvas 元素创建不依赖 Vue 或 React 的电子签名控制器。
 */
export const createSignatureCanvas = (
  canvas: HTMLCanvasElement,
  options: SignatureOptions = {},
): SignatureController => {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create a 2D canvas context.');

  let isDrawing = false;
  const lineWidth = options.lineWidth ?? 2;
  const strokeStyle = options.strokeStyle ?? '#000';
  const lineCap = options.lineCap ?? 'round';
  const lineJoin = options.lineJoin ?? 'round';

  const applyStrokeStyle = () => {
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.lineCap = lineCap;
    context.lineJoin = lineJoin;
  };

  const startDraw = (event: SignaturePointerEvent) => {
    const point = getCanvasPoint(canvas, event);
    isDrawing = true;
    applyStrokeStyle();
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event: SignaturePointerEvent) => {
    if (!isDrawing) return;
    const point = getCanvasPoint(canvas, event);
    applyStrokeStyle();
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const endDraw = () => {
    isDrawing = false;
    context.closePath();
  };

  return {
    startDraw,
    draw,
    endDraw,
    clear: () => context.clearRect(0, 0, canvas.width, canvas.height),
    getBase64DataUrl: (type = 'image/png', quality?: number) => canvas.toDataURL(type, quality),
    destroy: () => {
      isDrawing = false;
    },
  };
};
