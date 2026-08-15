# @central-platform/tools

Browser-side utilities shared by Central Platform apps.

The PDF helpers are framework-agnostic. Apps own the DOM and React lifecycle, while this package handles PDF.js worker setup, document loading, page rendering, and cancellation.

```ts
import { loadPdfDocument, renderPdfPage } from '@central-platform/tools';

const loadingTask = loadPdfDocument('/demo.pdf');
const document = await loadingTask.promise;
await renderPdfPage(document, canvas, 1, { scale: 1.35, signal });
await loadingTask.destroy();
```

## Web Console

The web console helper is framework-agnostic and loads Eruda only when debugging is enabled:

```ts
import { initWebConsole } from '@central-platform/tools';

void initWebConsole();
```

Append `?debug=1` to enable the console for the current browser. The setting is persisted in `localStorage`; append `?debug=0` to disable it and clear the setting.

## Signature

The signature API is framework-agnostic. Create a controller after the canvas is mounted, then bind its methods to the framework's mouse events:

```ts
import { createSignatureCanvas } from '@central-platform/tools';

const controller = createSignatureCanvas(canvasElement);

canvasElement.addEventListener('mousedown', (event) => controller.startDraw(event));
canvasElement.addEventListener('mousemove', (event) => controller.draw(event));
canvasElement.addEventListener('mouseup', controller.endDraw);
canvasElement.addEventListener('mouseleave', controller.endDraw);

const base64 = controller.getBase64DataUrl();
controller.clear();
controller.destroy();
```
