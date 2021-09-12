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
 * Calculate target pixel in x coordinate
 * @param {Pixel[][]} matrix
 * @param {Pixel} result
 * @param {number} i
 * @param {number} j
 * @param {number} srcX
 * @param {number} srcWidth
 */
const xCoorCalculation = (matrix, target, i, j, srcX, srcWidth) => {
  const x0 = getClip(i, 0, srcWidth - 1);
  const x1 = getClip(i + 1, 0, srcWidth - 1);

  const p0 = matrix[j][x0];
  const p1 = matrix[j][x1];

  /**
   * p = p0 + (x - x0) * (p1 - p0) / (x1 - x0)
   */
  keys.forEach(
    /**
     * @param {keyof Pixel} key
     */
    (key) => {
      const p = Math.round(
        p0[key] + ((srcX - x0) * (p1[key] - p0[key])) / (x1 - x0)
      );
      target[key] = getClip(p, 0, 255);
    }
  );
};

/**
 * Calculate target pixel in y coordinate
 * @param {Pixel[][]} matrix
 * @param {Pixel} result
 * @param {number} i
 * @param {number} j
 * @param {number} srcY
 * @param {number} srcHeight
 */
const yCoorCalculation = (matrix, target, i, j, srcY, srcHeight) => {
  const y0 = getClip(j, 0, srcHeight - 1);
  const y1 = getClip(j + 1, 0, srcHeight - 1);

  const p0 = matrix[y0][i];
  const p1 = matrix[y1][i];

  /**
   * p = p0 + (y - y0) * (p1 - p0) / (y1 - y0)
   */
  keys.forEach(
    /**
     * @param {keyof Pixel} key
     */
    (key) => {
      const p = Math.round(
        p0[key] + ((srcY - y0) * (p1[key] - p0[key])) / (y1 - y0)
      );
      target[key] = getClip(p, 0, 255);
    }
  );
};

/**
 * Bilinear Interpolation
 * @param {Pixel[][]} matrix
 * @param {number} destWidth
 * @param {number} destHeight
 * @param {'x' | 'y'} coor
 */
const linearInterpolation = (matrix, destWidth, destHeight, coor = "x") => {
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

      if (coor === "x") {
        xCoorCalculation(matrix, result[y][x], i, j, srcX, srcWidth);
      } else {
        yCoorCalculation(matrix, result[y][x], i, j, srcY, srcHeight);
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number, 'x' | 'y']} */
  const [matrix, destWidth, destHeight, coor] = evt.data;
  const result = linearInterpolation(matrix, destWidth, destHeight, coor);
  this.self.postMessage(result);
  this.self.close();
});
