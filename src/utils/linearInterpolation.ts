import { Pixel, PixelKey } from "./imageDataUtils";

import { getClip } from "src/utils";

const keys = ["R", "G", "B", "A"] as PixelKey[];

export const linearInterpolation = (
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

      const x0 = getClip(i, 0, srcWidth - 1);
      const x1 = getClip(i + 1, 0, srcWidth - 1);

      const y0 = matrix[j][x0];
      const y1 = matrix[j][x1];

      keys.forEach((key: "R" | "G" | "B" | "A") => {
        result[y][x][key] =
          y0[key] + ((srcX - x0) * (y1[key] - y0[key])) / (x1 - x0);
      });
    }
  }
  return result;
};
