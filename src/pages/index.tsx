import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ImageUploader from "../components/ImageUploader";
import LayoutSelector from "../components/LayoutSelector";
import PhotoCanvas from "../components/PhotoCanvas";
import ExportButton from "../components/ExportButton";

const LAYOUTS = [
  { name: "2x2", rows: 2, cols: 2 },
  { name: "4x4", rows: 4, cols: 4 },
];

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState(LAYOUTS[0]);
  const [gridData, setGridData] = useState<(string | null)[]>(
    Array(layout.rows * layout.cols).fill(null)
  );
  const canvasRef = React.useRef<HTMLDivElement>(null); // 新增引用
  const [gap, setGap] = useState(1); // 新增 gap 状态
  const [padding, setPadding] = useState(4); // 新增 padding 状态

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
          <div style={{ marginTop: 16 }}>
            <LayoutSelector
              layouts={LAYOUTS}
              layout={layout}
              setLayout={setLayout}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <label>
              <span>格子间距:</span>
              <input
                type="range"
                min="0"
                max="10"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>
          <div style={{ marginTop: 16 }}>
            <label>
              <span>画布内边距:</span>
              <input
                type="range"
                min="0"
                max="50"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                style={{ marginLeft: 8 }}
              />
            </label>
          </div>
          <div style={{ marginTop: 24 }}>
            <ExportButton
              gridData={gridData}
              layout={layout}
              canvasRef={canvasRef} // 传递引用
            />
          </div>
        </div>
        {/* 右侧画布区 */}
        <div style={{ flex: 1 }} ref={canvasRef}> {/* 绑定引用 */}
          <PhotoCanvas
            images={images}
            gridData={gridData}
            setGridData={setGridData}
            layout={layout}
            gap={gap} // 传递 gap
            padding={padding} 
          />
        </div>
      </div>
    </DndProvider>
  );
}