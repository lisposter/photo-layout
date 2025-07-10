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
  console.log(layouts)
  return (
    <div className="flex items-center">
      <span className="mr-2">拼图布局：</span>
      {layouts.map((lay) => (
        <button
          key={lay.name}
          onClick={() => setLayout(lay)}
          className={`mr-2 px-3 py-1 rounded border ${
            layout.name === lay.name
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-800 border-blue-500"
          } hover:bg-blue-100`}
        >
          {lay.name}
        </button>
      ))}
    </div>
  );
}
