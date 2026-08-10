import { FilePdfOutlined } from '@ant-design/icons';
import { Alert, Spin } from 'antd';
import {
  destroyPdfDocument,
  loadPdfDocument,
  renderPdfPage,
  type PDFDocumentProxy,
} from '@central-platform/tools';
import { Modal } from '@central-platform/ui';
import { useEffect, useRef, useState } from 'react';

interface PdfPageProps {
  document: PDFDocumentProxy;
  pageNumber: number;
}

const PdfPage = ({ document, pageNumber }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const controller = new AbortController();
    void renderPdfPage(document, canvas, pageNumber, {
      scale: 1.35,
      signal: controller.signal,
    }).catch(() => undefined);

    return () => controller.abort();
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
    const loadingTask = loadPdfDocument(fileUrl, { moduleUrl: import.meta.url });

    void loadingTask.promise
      .then((loadedDocument) => {
        if (active) setDocument(loadedDocument);
      })
      .catch(() => {
        if (active) setError('PDF 文件加载失败，请稍后重试。');
      });

    return () => {
      active = false;
      void destroyPdfDocument(loadingTask);
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
      size="large"
      open={open}
      onCancel={handleClose}
      footer={null}
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
