export interface SignaturePointerEvent {
  clientX: number;
  clientY: number;
}

export interface SignatureOptions {
  lineWidth?: number;
  strokeStyle?: string;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

export interface SignatureController {
  startDraw: (event: SignaturePointerEvent) => void;
  draw: (event: SignaturePointerEvent) => void;
  endDraw: () => void;
  clear: () => void;
  getBase64DataUrl: (type?: string, quality?: number) => string;
  destroy: () => void;
}
