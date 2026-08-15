import { FilePdfOutlined } from '@ant-design/icons';
import {
  destroyPdfDocument,
  loadPdfDocument,
  renderPdfPage,
  type PDFDocumentProxy,
} from '@central-platform/tools';
import { Button, Modal } from '@central-platform/ui';
import { Alert, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface PdfPageProps {
  document: PDFDocumentProxy;
  pageNumber: number;
}

const PdfPage = ({ document, pageNumber }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const controller = new AbortController();
    void renderPdfPage(document, canvas, pageNumber, {
      scale: 1.35,
      signal: controller.signal,
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      console.error(`PDF 第 ${pageNumber} 页渲染失败`, error);
      setRenderError(true);
    });

    return () => controller.abort();
  }, [document, pageNumber]);

  return (
    <div className="product-pdf-page">
      <canvas ref={canvasRef} hidden={renderError} aria-label={`PDF 第 ${pageNumber} 页`} />
      {renderError && <Alert type="error" showIcon message={`第 ${pageNumber} 页渲染失败`} />}
      <span>第 {pageNumber} 页</span>
    </div>
  );
};

interface PdfPreviewModalProps {
  open: boolean;
  title: string;
  fileUrl: string;
  onClose: () => void;
}

const PdfPreviewModal = ({ open, title, fileUrl, onClose }: PdfPreviewModalProps) => {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!open) return undefined;

    let active = true;
    const loadingTask = loadPdfDocument(fileUrl, {
      moduleUrl: import.meta.url,
      withCredentials: true,
      disableRange: true,
      disableStream: true,
    });

    void loadingTask.promise
      .then((loadedDocument) => {
        if (active) setDocument(loadedDocument);
      })
      .catch((loadError: unknown) => {
        console.error('PDF 文件加载失败', { fileUrl, loadError });
        if (active) setError('PDF 文件加载失败，请检查网络后重试。');
      });

    return () => {
      active = false;
      void destroyPdfDocument(loadingTask);
    };
  }, [fileUrl, open, reloadKey]);

  const retry = () => {
    setDocument(null);
    setError('');
    setReloadKey((current) => current + 1);
  };

  return (
    <Modal
      className="product-pdf-preview-modal"
      size="large"
      open={open}
      onCancel={onClose}
      footer={null}
      getContainer={false}
      title={<span className="product-pdf-preview-title"><FilePdfOutlined />{title}</span>}
    >
      <div className="product-pdf-viewer">
        {error && (
          <div className="product-pdf-error">
            <Alert type="error" message={error} showIcon />
            <Button onClick={retry}>重新加载</Button>
          </div>
        )}
        {!error && !document && <Spin size="large" tip="正在解析 PDF..." />}
        {document && Array.from({ length: document.numPages }, (_, index) => (
          <PdfPage key={index + 1} document={document} pageNumber={index + 1} />
        ))}
      </div>
    </Modal>
  );
};

export default PdfPreviewModal;
