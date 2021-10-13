const colors = ["R", "G", "B"];

/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/**
 * Geometric Mean Filter
 * @param {Pixel[][]} matrix
 * @param {number} size   // Kernel size
 */
const geometricMeanFilter = (matrix, size) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const offset = Math.floor(size / 2);
  const numberOfPixels = size * size;

  const result = matrix.map((row) => row.map((pixel) => ({ ...pixel })));

  /**
   * Loop for center pixel
   */
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      const products = { R: 1, G: 1, B: 1 };
      /**
       * Loop for the mask
       * get the number of pixels of each level value
       */
      for (let j = 0; j < size; j++) {
        const t = y - offset + j;
        for (let i = 0; i < size; i++) {
          const s = x - offset + i;
          for (let color of colors) {
            // product *= pixel
            products[color] *= matrix?.[t]?.[s]?.[color] ?? 1;
          }
        }
      }

      for (let color of colors) {
        // Calculate geometric mean
        // g = product ^ (1 / (m * n))
        result[y][x][color] = Math.round(
          Math.pow(products[color], 1 / numberOfPixels)
        );
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number]} */
  const [matrix, size] = evt.data;
  const result = geometricMeanFilter(matrix, size);
  this.self.postMessage(result);
  this.self.close();
});
