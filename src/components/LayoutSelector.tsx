import React from "react";

interface Layout {
  name: string;
  rows: number;
  cols: number;
}
interface Props {
  layouts: Layout[];
  layout: Layout;
  setLayout: (lay: Layout) => void;
}

export default function LayoutSelector({ layouts, layout, setLayout }: Props) {
  return (
    <div>
      <span style={{ marginRight: 8 }}>拼图布局：</span>
      {layouts.map((lay) => (
        <button
          key={lay.name}
          onClick={() => setLayout(lay)}
          style={{
            marginRight: 8,
            padding: "4px 12px",
            background: layout.name === lay.name ? "#1677ff" : "#fff",
            color: layout.name === lay.name ? "#fff" : "#222",
            border: "1px solid #1677ff",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {lay.name}
        </button>
      ))}
    </div>
  );
}