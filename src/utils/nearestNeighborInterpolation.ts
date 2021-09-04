import { Pixel } from "./imageDataUtils";

import { getClip } from "src/utils";

export const nearestNeighborInterpolation = (
  matrix: Pixel[][],
  destWidth: number,
  destHeight: number
): Pixel[][] => {
  const srcWidth = matrix[0].length;
  const srcHeight = matrix.length;

  const widthRatio = srcWidth / destWidth;
  const heightRatio = srcHeight / destHeight;

  const result: Pixel[][] = Array.from({ length: destHeight }).map(() =>
    Array.from({ length: destWidth }).map(() => ({ R: 0, G: 0, B: 0, A: 0 }))
  );

  for (let y = 0; y < destHeight; y++) {
    const srcY = y * heightRatio;
    const j = getClip(Math.round(srcY), 0, srcHeight - 1);
    for (let x = 0; x < destWidth; x++) {
      const srcX = x * widthRatio;
      const i = getClip(Math.round(srcX), 0, srcWidth - 1);
      const srcPixel = matrix[j][i];
      result[y][x] = { ...srcPixel };
    }
  }
  return result;
};
