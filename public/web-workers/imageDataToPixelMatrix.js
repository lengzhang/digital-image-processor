/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/**
 *
 * @param {ImageData} imageData
 */
const imageDataToPixelMatrix = (imageData) => {
  /** @type {Pixel[][]} */
  const matrix = [];

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

this.self.addEventListener("message", (evt) => {
  /** @type {[ImageData]} */
  const [imageData] = evt.data;
  const [matrix, isGrayScaled] = imageDataToPixelMatrix(imageData);
  this.self.postMessage([matrix, isGrayScaled]);
  this.self.close();
});
