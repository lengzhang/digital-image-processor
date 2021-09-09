/**
 * getClip returns a number within the range
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const getClip = (x, min, max) => (x < min ? min : max < x ? max : x);

/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/**
 * Bilinear Interpolation
 * @param {Pixel[][]} matrix
 * @param {number} destWidth
 * @param {number} destHeight
 */
const bilinearInterpolation = (matrix, destWidth, destHeight) => {
  const srcWidth = matrix[0].length;
  const srcHeight = matrix.length;

  const widthRatio = srcWidth / destWidth;
  const heightRatio = srcHeight / destHeight;

  /** @type {Pixel[][]} */
  const result = Array.from({ length: destHeight }).map(() =>
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

// eslint-disable-next-line
self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, destWidth, destHeight] = evt.data;
  const result = bilinearInterpolation(matrix, destWidth, destHeight);
  // eslint-disable-next-line
  self.postMessage(result);
  self.close()
});
