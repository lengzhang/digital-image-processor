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
      const list = { R: [], G: [], B: [] };
      /**
       * Loop for the mask
       * get the number of pixels of each level value
       */
      for (let j = 0; j < size; j++) {
        const t = y - offset + j;
        for (let i = 0; i < size; i++) {
          const s = x - offset + i;
          for (let color of colors) {
            const tmp = matrix?.[t]?.[s]?.[color] ?? 0;
            list[color].push(tmp);
          }
        }
      }

      for (let color of colors) {
        /**
         * Calculate contraharmonic mean
         * a += x^(order + 1)
         * b += x^order
         */
        const [a, b] = list[color].reduce(
          ([a, b], v) => [a + Math.pow(v, order + 1), b + Math.pow(v, order)],
          [0, 0]
        );
        // result = a / b
        result[y][x][color] = Math.round(a / b) || 0;
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
