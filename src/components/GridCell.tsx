import React from "react";
import { useDrop, useDrag } from "react-dnd";

const CELL_TYPE = "CELL_IMAGE";

interface DragItem {
  type: string;
  image?: string;
  fromCellIdx?: number;
  file?: File;
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
      onDropImage(index, item.image);
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
        <img
          src={image}
          alt="img"
          draggable={false}
          className="w-full h-full object-cover pointer-events-none select-none"
        />
      ) : (
        <span className="text-gray-500 text-sm print:hidden">拖拽图片到此</span>
      )}
    </div>
  );
}
