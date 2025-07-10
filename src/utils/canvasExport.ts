/**
 * 导出grid拼图为4x6相纸高清图片
 * @param gridData (string|null)[]
 * @param rows
 * @param cols
 * @returns Promise<string> 图片DataURL
 */
export async function exportGridToImage(
  gridData: (string | null)[],
  rows: number,
  cols: number
): Promise<string> {
  // 1800x1200 px，300dpi，4x6英寸
  const width = 1800;
  const height = 1200;
  const cellW = width / cols;
  const cellH = height / rows;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < gridData.length; ++i) {
    const imgUrl = gridData[i];
    if (!imgUrl) continue;
    const img = await loadImage(imgUrl);
    // 计算目标格子位置
    const row = Math.floor(i / cols);
    const col = i % cols;
    // 保持图片比例居中填满格子
    const [dx, dy, dw, dh] = getCoverFit(
      img.width,
      img.height,
      cellW,
      cellH,
      col * cellW,
      row * cellH
    );
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // 画格子线
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 2;
  for (let c = 1; c < cols; ++c) {
    ctx.beginPath();
    ctx.moveTo(c * cellW, 0);
    ctx.lineTo(c * cellW, height);
    ctx.stroke();
  }
  for (let r = 1; r < rows; ++r) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellH);
    ctx.lineTo(width, r * cellH);
    ctx.stroke();
  }

  return canvas.toDataURL("image/jpeg", 0.98);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

function getCoverFit(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
  x: number,
  y: number
): [number, number, number, number] {
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const dw = imgW * scale;
  const dh = imgH * scale;
  const dx = x + (boxW - dw) / 2;
  const dy = y + (boxH - dh) / 2;
  return [dx, dy, dw, dh];
}