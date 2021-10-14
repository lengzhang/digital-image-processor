/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/** @type {keyof Pixel} */
const colors = ["R", "G", "B"];

/**
 *
 * @param {{R: number[], G: number[], B: number[]}} mapper
 * @param {number} length
 * @param {number} numOfPixel
 * @returns {{R: number[], G: number[], B: number[]}}
 */
const calculateHE = (mapper, length, numOfPixel) => {
  /**
   * l = L - 1 = the max level value
   * s_k = (L - 1) sum^k_(j=0) (p_r(r_j))
   *
   * sTmp_k = sum^k_(j=0) (heMapper_j)
   * s_k = Math.round(l * sTmp_k / numOfPixel)
   */
  const s = {
    R: Array.from({ length }).fill(0),
    G: Array.from({ length }).fill(0),
    B: Array.from({ length }).fill(0),
  };
  const sTmp = { R: 0, G: 0, B: 0 };
  const l = length - 1;
  for (let k = 0; k < length; k++) {
    for (let color of colors) {
      sTmp[color] += mapper[color][k];
      s[color][k] = Math.round((l * sTmp[color]) / numOfPixel);
    }
  }
  return s;
};

/**
 * Histogram Equalization Global
 * @param {Pixel[][]} matrix
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
const globalHelper = (matrix, x1, y1, x2, y2) => {
  const length = Math.pow(2, 8);
  const mapper = {
    R: Array.from({ length }).fill(0),
    G: Array.from({ length }).fill(0),
    B: Array.from({ length }).fill(0),
  };
  let numOfPixel = 0;
  /**
   * Calculate number of pixels of each level value
   * and get the total number of pixels
   */
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const pixel = matrix[y][x];
      for (let color of colors) mapper[color][pixel[color]]++;
      numOfPixel++;
    }
  }

  const he = calculateHE(mapper, length, numOfPixel);

  return matrix.map((row, j) =>
    row.map((pixel, i) => {
      // Copy pixel if not in the range
      if (j < y1 || j > y2 || i < x1 || i > x2) return { ...pixel };
      // Get pixel colors from he if in the range
      return colors.reduce(
        (acc, color) => ({ ...acc, [color]: he[color][pixel[color]] }),
        { ...pixel }
      );
    })
  );
};

/**
 * Histogram Equalization Local
 * @param {Pixel[][]} matrix
 * @param {number} size
 */
const localHelper = (matrix, size) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const offset = Math.floor(size / 2);
  const length = Math.pow(2, 8);

  const result = matrix.map((row) => row.map((pixel) => ({ ...pixel })));
  const numOfPixel = size * size;

  /**
   * Loop for center pixel
   */
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      const mapper = {
        R: Array.from({ length }).fill(0),
        G: Array.from({ length }).fill(0),
        B: Array.from({ length }).fill(0),
      };
      /**
       * Loop for the mask around the center pixel
       * get the number of pixels of each level value
       */
      for (let j = y - offset; j <= y + offset; j++) {
        for (let i = x - offset; i <= x + offset; i++) {
          // If i or j is out of range
          if (j < 0 || j >= col || i < 0 || i >= row) {
            for (let color of colors) mapper[color][0]++;
          } else {
            const pixel = matrix[j][i];
            for (let color of colors) mapper[color][pixel[color]]++;
          }
        }
      }

      const he = calculateHE(mapper, length, numOfPixel);

      for (let color of colors) {
        result[y][x][color] = he[color][result[y][x][color]];
      }
    }
  }

  return result;
};

/**
 * Histogram Equalization
 * @param {Pixel[][]} matrix
 * @param {?number} size
 */
const histogramEqualization = (matrix, size) => {
  if (size === undefined) {
    return globalHelper(matrix, 0, 0, matrix[0].length - 1, matrix.length - 1);
  }
  return localHelper(matrix, size);
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, size] = evt.data;
  const result = histogramEqualization(matrix, size);
  this.self.postMessage(result);
  this.self.close();
});
