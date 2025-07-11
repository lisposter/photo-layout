import React, { useState } from "react";
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
  gap: number; // 新增 gap 属性
  padding: number; // Add padding property
}

export default function PhotoCanvas({
  gridData,
  setGridData,
  layout,
  gap,
  padding, // Destructure padding
}: Props) {
  const { rows, cols } = layout;

  // Maintain a 4x6 aspect ratio
  const canvasWidth = 400;
  const canvasHeight = 600;

  const [rotationData, setRotationData] = useState<number[]>(
    Array(rows * cols).fill(0)
  );

  // Rotate image in a cell
  const onRotateCell = (cellIdx: number) => {
    setRotationData((prev) => {
      const next = [...prev];
      next[cellIdx] = (next[cellIdx] + 90) % 360;
      return next;
    });
  };

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
      className="bg-white border-2 border-blue-600 print:border-none print:bg-transparent grid relative"
      style={{
        width: canvasWidth + padding * 2, // Apply padding to width
        height: canvasHeight + padding * 2, // Apply padding to height
        padding: `${padding}px`, // Set padding
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: `${gap}px`, // 应用 gap
      }}
    >
      {Array(rows * cols)
        .fill(null)
        .map((_, idx) => (
          <GridCell
            key={idx}
            index={idx}
            image={gridData[idx]}
            rotation={rotationData[idx]} // Pass rotation
            layoutConfig={{
              rows,
              cols,
              canvasWidth,
              canvasHeight,
              gap,
              padding, // Pass padding to layoutConfig
            }}
            onDropImage={onDropImageToCell}
            onSwap={onSwapCell}
            onRotate={onRotateCell} // Pass rotate handler
          />
        ))}
    </div>
  );
}
