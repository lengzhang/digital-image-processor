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

/** @type {keyof Pixel} */
const keys = ["R", "G", "B", "A"];

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

      const x0 = getClip(i, 0, srcWidth - 1);
      const x1 = getClip(i + 1, 0, srcWidth - 1);

      const y0 = matrix[j][x0];
      const y1 = matrix[j][x1];

      keys.forEach(
        /**
         * @param {keyof Pixel} key
         */
        (key) => {
          result[y][x][key] =
            y0[key] + ((srcX - x0) * (y1[key] - y0[key])) / (x1 - x0);
        }
      );
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
