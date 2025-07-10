import React, { useRef } from "react";
import { exportGridToImage } from "../utils/canvasExport";
import { useReactToPrint } from "react-to-print";

interface Layout {
  name: string;
  rows: number;
  cols: number;
}
interface Props {
  gridData: (string | null)[];
  layout: Layout;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export default function ExportButton({ gridData, layout, canvasRef }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleExport = async () => {
    const url = await exportGridToImage(gridData, layout.rows, layout.cols);
    if (ref.current) {
      ref.current.href = url;
      ref.current.download = "拼图4x6.jpg";
      ref.current.click();
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: canvasRef, // Ensure the correct DOM element is returned
  });

  return (
    <>
      <button
        onClick={handleExport}
        className="px-6 py-2 bg-blue-600 text-white rounded font-medium text-lg hover:bg-blue-700"
      >
        导出
      </button>
      <button
        onClick={handlePrint}
        className="px-6 py-2 bg-blue-600 text-white rounded font-medium text-lg hover:bg-blue-700 ml-4"
      >
        打印拼图
      </button>
      <a ref={ref} className="hidden">
        download
      </a>
    </>
  );
}
