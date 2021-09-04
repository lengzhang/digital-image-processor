import { Pixel, PixelKey } from "./imageDataUtils";

import { getClip } from "src/utils";

// https://www.cxyzjd.com/article/u012679980/49449647

export const bilinearInterpolation = (
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
    const j = Math.floor(srcY);
    const b = srcY - j;
    for (let x = 0; x < destWidth; x++) {
      const srcX = x * widthRatio;
      const i = Math.floor(srcX);
      const a = srcX - i;

      /**
       * (i, j + 1) |           | (i + 1, j + 1)
       *           ---------------
       *            |  (x, y)   |
       *            | <----     |
       *            |     |     |
       *            |     v     |
       *           ---------------
       *     (i, j) |           | (i + 1, j)
       *
       * F(x, y) = (1 - a)(1 - b) F(i, j)
       *         + a(1 - b)       F(i + 1, j)
       *         + ab             F(i + 1, j + 1)
       *         + (1 - a)b       F(i, j + 1)
       * =>
       * Dest(x, y) = (1 - a)(1 - b) Src(i, j)
       *            + a(1 - b)       Src(i + 1, j)
       *            + ab             Src(i + 1, j + 1)
       *            + (1 - a)b       Src(i, j + 1)
       */
      const coffiecent1 = (1 - a) * (1 - b);
      const coffiecent2 = a * (1 - b);
      const coffiecent3 = a * b;
      const coffiecent4 = (1 - a) * b;

      /**
       * Q12(x1, y2) |           | Q22(x2, y2)
       *            ---------------
       *             |  (x, y)   |
       *             | <----     |
       *             |     |     |
       *             |     v     |
       *            ------------------
       * Q11(x1, y1) |              | Q21(x2, y1)
       *
       * Dest(x, y) = coffiecent1 * Q11
       *            + coffiecent2 * Q21
       *            + coffiecent3 * Q22
       *            + coffiecent4 * Q12
       */

      const x1 = getClip(i, 0, srcWidth - 1);
      const x2 = getClip(i + 1, 0, srcWidth - 1);
      const y1 = getClip(j, 0, srcHeight - 1);
      const y2 = getClip(j + 1, 0, srcHeight - 1);

      const Q11 = matrix[y1][x1];
      const Q21 = matrix[y1][x2];
      const Q22 = matrix[y2][x2];
      const Q12 = matrix[y2][x1];

      const keys = ["R", "G", "B", "A"] as PixelKey[];

      keys.forEach((key: "R" | "G" | "B" | "A") => {
        result[y][x][key] =
          coffiecent1 * Q11[key] +
          coffiecent2 * Q21[key] +
          coffiecent3 * Q22[key] +
          coffiecent4 * Q12[key];
      });
    }
  }

  return result;
};
