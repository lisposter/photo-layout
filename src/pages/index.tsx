import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ImageUploader from "../components/ImageUploader";
import LayoutSelector from "../components/LayoutSelector";
import PhotoCanvas from "../components/PhotoCanvas";
import ExportButton from "../components/ExportButton";

const LAYOUTS = [
  { name: "4x4", rows: 4, cols: 4 },
  { name: "2x2", rows: 2, cols: 2 },
];

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState(LAYOUTS[0]);
  const [gridData, setGridData] = useState<(string | null)[]>(
    Array(layout.rows * layout.cols).fill(null)
  );

  // 当布局变化时，重置画布
  React.useEffect(() => {
    setGridData(Array(layout.rows * layout.cols).fill(null));
  }, [layout]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          padding: 32,
          display: "flex",
          gap: 32,
          minHeight: "100vh",
          background: "#f2f2f2",
        }}
      >
        {/* 左侧图片上传区 */}
        <div style={{ width: 250, flexShrink: 0 }}>
          <h2>上传照片</h2>
          <ImageUploader images={images} setImages={setImages} />
        </div>
        {/* 右侧画布和控制区 */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <LayoutSelector
              layouts={LAYOUTS}
              layout={layout}
              setLayout={setLayout}
            />
          </div>
          <PhotoCanvas
            images={images}
            gridData={gridData}
            setGridData={setGridData}
            layout={layout}
          />
          <div style={{ marginTop: 24 }}>
            <ExportButton gridData={gridData} layout={layout} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}