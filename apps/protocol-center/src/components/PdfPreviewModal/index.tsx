import { FilePdfOutlined } from '@ant-design/icons';
import { Alert, Modal, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Resolve the worker against the remote module origin so Shell does not request
// the worker from its own host when this app is loaded through Module Federation.
const protocolCenterOrigin = new URL(import.meta.url).origin;
GlobalWorkerOptions.workerSrc = pdfWorkerUrl.startsWith('http')
  ? pdfWorkerUrl
  : `${protocolCenterOrigin}${pdfWorkerUrl.startsWith('/') ? pdfWorkerUrl : `/${pdfWorkerUrl}`}`;

interface PdfPageProps {
  document: PDFDocumentProxy;
  pageNumber: number;
}

const PdfPage = ({ document, pageNumber }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let renderTask: ReturnType<Awaited<ReturnType<typeof document.getPage>>['render']> | undefined;

    const renderPage = async () => {
      const page = await document.getPage(pageNumber);
      if (cancelled || !canvasRef.current) return;

      const viewport = page.getViewport({ scale: 1.35 });
      const outputScale = window.devicePixelRatio || 1;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      renderTask = page.render({
        canvas,
        canvasContext: context,
        viewport,
        transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
      });
      await renderTask.promise;
    };

    void renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [document, pageNumber]);

  return (
    <div className="pdf-page">
      <canvas ref={canvasRef} aria-label={`PDF 第 ${pageNumber} 页`} />
      <span>第 {pageNumber} 页</span>
    </div>
  );
};

interface PdfPreviewModalProps {
  open: boolean;
  title: string;
  fileUrl: string | null;
  onClose: () => void;
}

const PdfPreviewModal = ({ open, title, fileUrl, onClose }: PdfPreviewModalProps) => {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !fileUrl) return undefined;

    let active = true;
    const loadingTask = getDocument({ url: fileUrl });

    void loadingTask.promise
      .then((loadedDocument) => {
        if (active) setDocument(loadedDocument);
      })
      .catch(() => {
        if (active) setError('PDF 文件加载失败，请稍后重试。');
      });

    return () => {
      active = false;
      void loadingTask.destroy();
    };
  }, [fileUrl, open]);

  const handleClose = () => {
    setDocument(null);
    setError('');
    onClose();
  };

  return (
    <Modal
      className="pdf-preview-modal"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={980}
      destroyOnHidden
      getContainer={false}
      title={
        <span className="preview-title">
          <FilePdfOutlined />
          {title}
        </span>
      }
    >
      <div className="pdf-viewer">
        {error && <Alert type="error" message={error} showIcon />}
        {!error && !document && <Spin size="large" tip="正在解析 PDF..." />}
        {document &&
          Array.from({ length: document.numPages }, (_, index) => (
            <PdfPage key={index + 1} document={document} pageNumber={index + 1} />
          ))}
      </div>
    </Modal>
  );
};

export default PdfPreviewModal;
