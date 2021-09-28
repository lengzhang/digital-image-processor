const colors = ["R", "G", "B"];

/**
 * Histogram Equalization Global
 * @param {Pixel[][]} matrix
 */
const globalHelper = (matrix, x1, y1, x2, y2) => {
  const length = Math.pow(2, 8);
  const heMapper = {
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
      for (let color of colors) heMapper[color][pixel[color]]++;
      numOfPixel++;
    }
  }

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
      sTmp[color] += heMapper[color][k];
      s[color][k] = Math.round((l * sTmp[color]) / numOfPixel);
    }
  }

  return matrix.map((row, j) =>
    row.map((pixel, i) => {
      // Copy pixel if not in the range
      if (j < y1 || j > y2 || i < x1 || i > x2) return { ...pixel };
      // Get pixel colors from s if in the range
      return colors.reduce(
        (acc, color) => ({ ...acc, [color]: s[color][pixel[color]] }),
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
  return matrix;
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
