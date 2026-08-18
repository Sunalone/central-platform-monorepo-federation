import {
  initPdf,
  renderPdf,
} from '@central-platform/tools';
import Button from 'antd-mobile/es/components/button';
import Popup from 'antd-mobile/es/components/popup';
import { useEffect, useRef, useState } from 'react';
import { getProductProtocolUrl } from '../../data/protocols';
import type { ProductProtocol } from '../../types/business';

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
      scale: 1.2,
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
    <section className="mobile-pdf-page" aria-label={`PDF 第 ${pageNumber} 页`}>
      <canvas ref={canvasRef} hidden={renderError} />
      {renderError && (
        <div className="mobile-pdf-page__error" role="alert">
          <strong>第 {pageNumber} 页渲染失败</strong>
          <span>请关闭弹窗后重新打开协议</span>
        </div>
      )}
      <span>第 {pageNumber} 页</span>
    </section>
  );
};

interface PdfPreviewPopupProps {
  protocol: ProductProtocol | null;
  onClose: () => void;
}

const PdfPreviewPopup = ({ protocol, onClose }: PdfPreviewPopupProps) => {
  const [document, setDocument] = useState<PdfDocument | null>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const fileUrl = protocol ? getProductProtocolUrl(protocol.fileName) : null;

  useEffect(() => {
    if (!protocol || !fileUrl) return undefined;

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
  }, [fileUrl, protocol, reloadKey]);

  const retry = () => {
    setDocument(null);
    setError('');
    setReloadKey((current) => current + 1);
  };

  return (
    <Popup
      visible={Boolean(protocol)}
      position="bottom"
      bodyClassName="mobile-pdf-popup"
      bodyStyle={{ height: 'min(92vh, 92dvh)', borderRadius: '22px 22px 0 0' }}
      closeOnMaskClick={false}
      destroyOnClose
      onClose={onClose}
    >
      {protocol && (
        <div className="mobile-pdf-dialog" role="dialog" aria-modal="true" aria-label={`${protocol.name}预览`}>
          <header className="mobile-pdf-header">
            <span className="mobile-pdf-badge">PDF</span>
            <div>
              <strong>{protocol.name}</strong>
              <span>{protocol.id} · {protocol.version}</span>
            </div>
            <Button fill="none" size="small" onClick={onClose}>关闭</Button>
          </header>

          <div className="mobile-pdf-viewer">
            {!error && !document && (
              <div className="mobile-pdf-state">
                <span className="mobile-pdf-loading" />
                <strong>正在解析协议文件</strong>
                <p>PDF.js 正在加载，请稍候</p>
              </div>
            )}
            {error && (
              <div className="mobile-pdf-state mobile-pdf-state--error">
                <strong>协议文件加载失败</strong>
                <p>{error}</p>
                <Button color="primary" size="small" onClick={retry}>重新加载</Button>
              </div>
            )}
            {document && Array.from({ length: document.numPages }, (_, index) => (
              <PdfPage key={index + 1} document={document} pageNumber={index + 1} />
            ))}
          </div>
        </div>
      )}
    </Popup>
  );
};

export default PdfPreviewPopup;
