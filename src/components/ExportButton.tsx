import React, { useRef } from "react";
import { exportGridToImage } from "../utils/canvasExport";

interface Layout {
  name: string;
  rows: number;
  cols: number;
}
interface Props {
  gridData: (string | null)[];
  layout: Layout;
}

export default function ExportButton({ gridData, layout }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleExport = async () => {
    const url = await exportGridToImage(gridData, layout.rows, layout.cols);
    if (ref.current) {
      ref.current.href = url;
      ref.current.download = "拼图4x6.jpg";
      ref.current.click();
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        style={{
          padding: "8px 24px",
          background: "#1677ff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: 500,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        导出高清图片（适合打印）
      </button>
      <a ref={ref} style={{ display: "none" }}>
        download
      </a>
    </>
  );
}