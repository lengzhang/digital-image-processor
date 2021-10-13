const colors = ["R", "G", "B"];

/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/**
 * Harmonic Mean Filter
 * @param {Pixel[][]} matrix
 * @param {number} size   // Kernel size
 * @param {number} order
 */
const contraharmonicMeanFilter = (matrix, size, order) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const offset = Math.floor(size / 2);

  const result = matrix.map((row) => row.map((pixel) => ({ ...pixel })));

  /**
   * Loop for center pixel
   */
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      // a += x^(order + 1)
      const a = { R: 0, G: 0, B: 0 };
      // b += x^order
      const b = { R: 0, G: 0, B: 0 };
      /**
       * Loop for the mask
       * get the number of pixels of each level value
       */
      for (let j = 0; j < size; j++) {
        const t = y - offset + j;
        for (let i = 0; i < size; i++) {
          const s = x - offset + i;
          for (let color of colors) {
            const pixel = matrix?.[t]?.[s]?.[color] ?? 0;
            a[color] += Math.pow(pixel, order + 1);
            b[color] += Math.pow(pixel, order);
          }
        }
      }

      for (let color of colors) {
        // Calculate contraharmonic mean
        // c = a / b
        result[y][x][color] = Math.round(a[color] / b[color]);
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, size, order] = evt.data;
  const result = contraharmonicMeanFilter(matrix, size, order);
  this.self.postMessage(result);
  this.self.close();
});
