import React from "react";
import GridCell from "./GridCell";

interface Layout {
  name: string;
  rows: number;
  cols: number;
}

interface Props {
  images: string[];
  gridData: (string | null)[];
  setGridData: (d: (string | null)[]) => void;
  layout: Layout;
}

export default function PhotoCanvas({
  images,
  gridData,
  setGridData,
  layout,
}: Props) {
  const { rows, cols } = layout;

  // 画布宽高比例4x6, 这里用600x400显示（实际导出用1800x1200）
  const canvasWidth = 600;
  const canvasHeight = 400;

  // 拖拽到格子
  const onDropImageToCell = (cellIdx: number, img: string) => {
    setGridData((prev) => {
      const next = [...prev];
      next[cellIdx] = img;
      return next;
    });
  };

  // 格子间图片调换
  const onSwapCell = (fromIdx: number, toIdx: number) => {
    setGridData((prev) => {
      const next = [...prev];
      [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
      return next;
    });
  };

  return (
    <div
      style={{
        width: canvasWidth,
        height: canvasHeight,
        background: "#fff",
        border: "2px solid #1677ff",
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 2,
        position: "relative",
      }}
    >
      {Array(rows * cols)
        .fill(null)
        .map((_, idx) => (
          <GridCell
            key={idx}
            index={idx}
            image={gridData[idx]}
            onDropImage={onDropImageToCell}
            onSwap={onSwapCell}
          />
        ))}
    </div>
  );
}