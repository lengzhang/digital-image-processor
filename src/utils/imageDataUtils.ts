import Jimp from "jimp";

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

export const imageDataToPixelMatrix = (
  imageData: ImageData
): [Pixel[][], boolean] => {
  const matrix: Pixel[][] = [];

  let isGrayScaled = true;

  for (let i = 0; i < imageData.height; i++) {
    for (let j = 0; j < imageData.width; j++) {
      if (matrix?.[i] === undefined) matrix.push([]);
      const index = i * imageData.width * 4 + j * 4;

      const R = imageData.data[index + 0];
      const G = imageData.data[index + 1];
      const B = imageData.data[index + 2];
      const A = imageData.data[index + 3];
      if (isGrayScaled && (R !== G || G !== B || B !== R)) isGrayScaled = false;
      matrix[i][j] = { R, G, B, A };
    }
  }
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
