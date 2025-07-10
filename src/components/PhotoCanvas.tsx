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

  // Maintain a 4x6 aspect ratio
  const canvasWidth = 400;
  const canvasHeight = 600;

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
      className="bg-white border-2 border-blue-600 print:border-none print:bg-transparent grid gap-0.5 relative"
      style={{
        width: canvasWidth,
        height: canvasHeight,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
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
