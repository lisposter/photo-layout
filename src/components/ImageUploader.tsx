import React from "react";
import { useDrag } from "react-dnd";

interface Props {
  images: string[];
  setImages: (imgs: string[]) => void;
}

export default function ImageUploader({ images, setImages }: Props) {
  const onFiles = (files: FileList) => {
    const arr = Array.from(files);
    Promise.all(
      arr.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target!.result as string);
            reader.readAsDataURL(file);
          })
      )
    ).then((newImages) => setImages([...images, ...newImages]));
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && onFiles(e.target.files)}
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {images.map((img, i) => (
          <DraggableImage key={i} img={img} />
        ))}
      </div>
    </div>
  );
}

function DraggableImage({ img }: { img: string }) {
  const [{ isDragging }, drag] = useDrag({
    type: "LIB_IMAGE",
    item: { type: "LIB_IMAGE", image: img },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <img
      ref={drag}
      src={img}
      alt="thumb"
      style={{
        width: 60,
        height: 60,
        objectFit: "cover",
        border: "1px solid #ccc",
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        background: "#fff",
      }}
    />
  );
}