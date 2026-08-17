import { Modal } from "@central-platform/ui";
import { useEffect, useRef, useState } from "react";
import { initPdf, renderPdf } from "@central-platform/tools";

type TProtocolModalProps = {
  isOpen: boolean;
  pdfUrl: string;
  onCancel: () => void;
};

const ProtocolModal: React.FC<TProtocolModalProps> = (props) => {
  const { isOpen, pdfUrl, onCancel } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [viewport, setViewport] = useState<any>();

  // 加载 PDF
  useEffect(() => {
    const loadPDF = async () => {
      const pdfDoc = await initPdf(pdfUrl);
      setPdfDoc(pdfDoc);
      setTotalPage(pdfDoc.numPages);
      setCurrentPage(1);
    };
    loadPDF();
  }, [pdfUrl]);

  // 渲染页面
  useEffect(() => {
    const renderPage = async (num: number) => {
      const { viewport } =
        (await renderPdf(pdfDoc, canvasRef.current, {
          pageNum: num
        })) ?? {};
      if (viewport) {
        setViewport(viewport);
      }
    };
    renderPage(currentPage);
  }, [isOpen, pdfDoc, currentPage, scale]);

  return (
    <Modal open={isOpen} onCancel={onCancel}>
      <div>
        <canvas ref={canvasRef} />
        <div>
          <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
            上一页
          </button>
          <span>
            {currentPage} / {totalPage}
          </span>
          <button disabled={currentPage >= totalPage} onClick={() => setCurrentPage((p) => p + 1)}>
            下一页
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProtocolModal;
