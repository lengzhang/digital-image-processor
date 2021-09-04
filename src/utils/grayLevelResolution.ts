import { Pixel } from "./imageDataUtils";

export type BitType = 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

export const grayLevelResolution = (matrix: Pixel[][], bit: BitType = 8) => {
  const level = Math.pow(2, bit);
  // Calculate Gray
  return matrix.map((row) => row.map((pixel) => calculateGray(pixel, level)));
};

const calculateGray = (pixel: Pixel, level: number): Pixel => {
  let gray = Math.pow(
    (Math.pow(pixel.R, 2.2) + Math.pow(pixel.G, 2.2) + Math.pow(pixel.B, 2.2)) /
      (1 + Math.pow(1.5, 2.2) + Math.pow(0.6, 2.2)),
    1 / 2.2
  );

  if (level !== 256) gray = quantize(gray, level);

  return { ...pixel, R: gray, G: gray, B: gray };
};

const quantize = (gray: number, level: number) => {
  const gap = Math.floor(256 / (level - 1));
  const ratio = ((gray + 1) / 256) * (level - 1);
  return Math.round(ratio) * gap;
};
