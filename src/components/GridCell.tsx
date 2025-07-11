/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useDrop, useDrag } from "react-dnd";

const CELL_TYPE = "CELL_IMAGE";

interface DragItem {
  type: string;
  image?: string;
  fromCellIdx?: number;
  file?: File;
}

interface LayoutConfig {
  canvasWidth: number;
  canvasHeight: number;
  cols: number;
  rows: number;
  gap: number;
  padding?: number;
}

interface Props {
  index: number;
  image: string | null;
  rotation: number; // New prop for rotation
  layoutConfig: LayoutConfig; // Added layoutConfig
  onDropImage: (cellIdx: number, img: string) => void;
  onSwap: (fromIdx: number, toIdx: number) => void;
  onRotate: (cellIdx: number) => void; // New prop for rotation handler
}

export default function GridCell({
  index,
  image,
  rotation,
  layoutConfig,
  onDropImage,
  onSwap,
  onRotate,
}: Props) {

  console.log('===', layoutConfig)
  // 计算每一个 cell 的最大宽高
  const cellWidth =
    (layoutConfig.canvasWidth - (layoutConfig.padding || 0) * 2) /
    layoutConfig.cols;
  const cellHeight =
    (layoutConfig.canvasHeight - (layoutConfig.padding || 0) * 2) /
    layoutConfig.rows;
  const maxCellWidth = cellWidth - layoutConfig.gap * (layoutConfig.cols - 1);
  const maxCellHeight = cellHeight - layoutConfig.gap * (layoutConfig.rows - 1);

  const [, drop] = useDrop<DragItem>({
    accept: [CELL_TYPE, "LIB_IMAGE", "FILE"],
    drop: (item) => {
      if (item.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onDropImage(index, e.target!.result as string);
        };
        reader.readAsDataURL(item.file);
      } else if (item.fromCellIdx !== undefined) {
        if (item.fromCellIdx !== index) {
          onSwap(item.fromCellIdx, index);
        }
      } else if (item.image) {
        onDropImage(index, item.image);
      }
    },
    canDrop: (item) => {
      if (item.fromCellIdx !== undefined && item.fromCellIdx === index)
        return false;
      return true;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: CELL_TYPE,
    item: () => ({
      type: CELL_TYPE,
      image: image!,
      fromCellIdx: index,
    }),
    canDrag: !!image,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropImgLib] = useDrop<DragItem>({
    accept: "LIB_IMAGE",
    drop: (item) => {
      if (item.image) {
        onDropImage(index, item.image);
      }
    },
  });

  const setRefs = (node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
    dropImgLib(node);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onDropImage(index, event.target!.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div
      ref={setRefs}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleFileDrop}
      className={`w-full h-full bg-gray-200 border border-dashed border-gray-400 print:border-none print:bg-transparent flex items-center justify-center overflow-hidden relative ${
        image ? "cursor-grab" : "cursor-pointer"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt="img"
            draggable={false}
            style={{
              transform: `rotate(${rotation}deg)`, // Apply rotation
              objectFit: "contain", // Ensure proportional scaling
              width: rotation % 180 === 0 ? "100%" : "auto", // Adjust width for rotation
              height: rotation % 180 === 0 ? "auto" : "100%", // Adjust height for rotation
              maxWidth: Math.max(maxCellHeight, maxCellWidth), 
              maxHeight: "100%", // Ensure it doesn't exceed cell bounds
            }}
            className="pointer-events-none select-none"
          />
          <button
            onClick={() => onRotate(index)} // Rotate button
            className="absolute print:hidden bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
          >
            旋转
          </button>
        </>
      ) : (
        <span className="text-gray-500 text-sm print:hidden">拖拽图片到此</span>
      )}
    </div>
  );
}
