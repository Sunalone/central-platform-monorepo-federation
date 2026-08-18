import { FilePdfOutlined } from '@ant-design/icons';
import { Alert, Spin } from 'antd';
import {
  initPdf,
  renderPdf,
} from '@central-platform/tools';
import { Modal } from '@central-platform/ui';
import { useEffect, useRef, useState } from 'react';

type PdfDocument = Awaited<ReturnType<typeof initPdf>>;

interface PdfPageProps {
  document: PdfDocument;
  pageNumber: number;
}

const PdfPage = ({ document, pageNumber }: PdfPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderedPageRef = useRef<{ document: PdfDocument; pageNumber: number } | null>(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const renderedPage = renderedPageRef.current;
    if (renderedPage?.document === document && renderedPage.pageNumber === pageNumber) {
      return undefined;
    }

    renderedPageRef.current = { document, pageNumber };
    let active = true;
    setRenderError(false);

    void renderPdf(document, canvas, {
      pageNum: pageNumber,
      scale: 1.35,
    }).catch((renderError: unknown) => {
      if (!active) return;
      console.error(`PDF 第 ${pageNumber} 页渲染失败`, renderError);
      setRenderError(true);
    });

    return () => {
      active = false;
    };
  }, [document, pageNumber]);

  return (
    <div className="pdf-page">
      <canvas ref={canvasRef} hidden={renderError} aria-label={`PDF 第 ${pageNumber} 页`} />
      {renderError && <Alert type="error" message={`PDF 第 ${pageNumber} 页渲染失败`} showIcon />}
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
  const [document, setDocument] = useState<PdfDocument | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !fileUrl) return undefined;

    let active = true;
    let loadedDocument: PdfDocument | null = null;

    void initPdf(fileUrl)
      .then((nextDocument) => {
        loadedDocument = nextDocument;
        if (active) setDocument(nextDocument);
        else void nextDocument.cleanup().catch(() => undefined);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        console.error('PDF 文件加载失败', { fileUrl, loadError });
        if (active) setError('PDF 文件加载失败，请稍后重试。');
      });

    return () => {
      active = false;
      if (loadedDocument) void loadedDocument.cleanup().catch(() => undefined);
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
