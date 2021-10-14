import { Pixel } from "src/utils/imageDataUtils";
import { colors } from "src/utils/constants";

export const removeDashAndUppercaseFirstLetter = (str: string) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const getClip = (x: number, min: number, max: number) =>
  x < min ? min : max < x ? max : x;

export const scrollToBottom = () => {
  const element = document?.getElementById("root");
  element?.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};

export const generateHistograms = (matrix: Pixel[][]) => {
  const he = {
    R: Array.from<number>({ length: 255 }).fill(0),
    G: Array.from<number>({ length: 255 }).fill(0),
    B: Array.from<number>({ length: 255 }).fill(0),
  };
  matrix.forEach((row) => {
    row.forEach((pixel) => {
      for (let color of colors) {
        let c = pixel[color];
        c = c < 0 ? 0 : c > 255 ? 255 : c;
        he[color][c]++;
      }
    });
  });
  return he;
};
