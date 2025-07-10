import React from "react";
import { useDrop, useDrag } from "react-dnd";

const CELL_TYPE = "CELL_IMAGE";

interface DragItem {
  type: string;
  image: string;
  fromCellIdx?: number;
}

interface Props {
  index: number;
  image: string | null;
  onDropImage: (cellIdx: number, img: string) => void;
  onSwap: (fromIdx: number, toIdx: number) => void;
}

export default function GridCell({
  index,
  image,
  onDropImage,
  onSwap,
}: Props) {
  // 1. 可将图片拖入格子
  const [, drop] = useDrop<DragItem>({
    accept: CELL_TYPE,
    drop: (item) => {
      // 如果来自别的格子，则交换
      if (item.fromCellIdx !== undefined) {
        if (item.fromCellIdx !== index) {
          onSwap(item.fromCellIdx, index);
        }
      } else {
        // 来自图片库
        onDropImage(index, item.image);
      }
    },
    canDrop: (item) => {
      // 不能自己拖到自己
      if (item.fromCellIdx !== undefined && item.fromCellIdx === index)
        return false;
      return true;
    },
  });

  // 2. 可将格子内容拖出（即格子间拖拽排序）
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

  // 支持图片库拖入
  const [, dropImgLib] = useDrop<DragItem>({
    accept: "LIB_IMAGE",
    drop: (item) => {
      onDropImage(index, item.image);
    },
  });

  // 合并ref
  const setRefs = (node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
    dropImgLib(node);
  };

  return (
    <div
      ref={setRefs}
      style={{
        width: "100%",
        height: "100%",
        background: "#eee",
        border: "1px dashed #aaa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: image ? "grab" : "pointer",
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
      }}
    >
      {image ? (
        <img
          src={image}
          alt="img"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      ) : (
        <span style={{ color: "#bbb", fontSize: 14 }}>拖拽图片到此</span>
      )}
    </div>
  );
}