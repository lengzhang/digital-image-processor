import Jimp from "jimp";

import { runWokrer } from "./runImageProcessWorker";

export const imageFileToImageData = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    Jimp.read(url)
      .then((image) => {
        const imageData = new ImageData(
          Uint8ClampedArray.from(image.bitmap.data),
          image.bitmap.width,
          image.bitmap.height
        );
        resolve(imageData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export interface Pixel {
  R: number;
  G: number;
  B: number;
  A: number;
}

export type PixelKey = keyof Pixel;

const IMAGE_DATA_TO_PIXEL_MATRIX_WORKER =
  "/web-workers/imageDataToPixelMatrix.js";
export const imageDataToPixelMatrix = async (
  imageData: ImageData
): Promise<[Pixel[][], boolean]> => {
  const [matrix, isGrayScaled] = await runWokrer<[Pixel[][], boolean]>(
    IMAGE_DATA_TO_PIXEL_MATRIX_WORKER,
    imageData
  );
  return [matrix, isGrayScaled];
};

export const pixelMatrixToImageData = (matrix: Pixel[][]) => {
  const height = matrix.length;
  const width = matrix[0].length;
  const data: number[] = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const { R, G, B, A } = matrix[i][j];
      data.push(R);
      data.push(G);
      data.push(B);
      data.push(A);
    }
  }
  const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
  return imageData;
};
