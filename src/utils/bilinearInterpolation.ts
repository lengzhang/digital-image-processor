import { Pixel, PixelKey } from "./imageDataUtils";

// https://www.cxyzjd.com/article/u012679980/49449647

const getClip = (x: number, min: number, max: number) =>
  x < min ? min : max < x ? max : x;

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
    const k = Math.floor(srcY);
    const c = srcY - k;
    for (let x = 0; x < destWidth; x++) {
      const srcX = x * widthRatio;
      const j = Math.floor(srcX);
      const u = srcX - j;

      /**
       * ----------------------
       * |         |          |
       * | S(j, k) | S(j+1, k)|
       * |         |          |
       * ----------|-----------
       * |         |          |
       * | S(j,k+1)|S(j+1,k+1)|
       * |         |          |
       * ----------------------
       *
       * D(x, y) = S(j + c, k + u)
       *
       * Q11 = S(j, k)(1 - c) + S(j+1, k) * c
       * Q22 = S(j, k+1) * (1 - c) + S(j+1, k+1) * c
       *
       * D(x, y) = Q11 * (1 - u) + Q22 * u
       *         = S(j, k) * (1 - c) * (1 - u)
       *         + S(j+1, k) * c * (1 - u)
       *         + S(j, k+1) * (1 - c) * u
       *         + S(j+1, k+1) * c * u
       */

      const coffiecent1 = (1 - c) * (1 - u);
      const coffiecent2 = c * (1 - u);
      const coffiecent3 = c * u;
      const coffiecent4 = (1 - c) * u;

      // A = S(j, k)
      const A =
        matrix[getClip(k, 0, srcHeight - 1)][getClip(j, 0, srcWidth - 1)];
      // B = S(j + 1, k)
      const B =
        matrix[getClip(k + 1, 0, srcHeight - 1)][getClip(j, 0, srcWidth - 1)];
      // C = S(j + 1, k + 1)
      const C =
        matrix[getClip(k + 1, 0, srcHeight - 1)][
          getClip(j + 1, 0, srcWidth - 1)
        ];
      // D = S(j, k + 1)
      const D =
        matrix[getClip(k, 0, srcHeight - 1)][getClip(j + 1, 0, srcWidth - 1)];

      const keys = ["R", "G", "B", "A"] as PixelKey[];

      keys.forEach((key: "R" | "G" | "B" | "A") => {
        result[y][x][key] =
          coffiecent1 * A[key] +
          coffiecent2 * B[key] +
          coffiecent3 * C[key] +
          coffiecent4 * D[key];
      });
    }
  }

  return result;
};
