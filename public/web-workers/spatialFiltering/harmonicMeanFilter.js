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
 */
const harmonicMeanFilter = (matrix, size) => {
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
      const sums = { R: 0, G: 0, B: 0 };
      /**
       * Loop for the mask
       * get the number of pixels of each level value
       */
      for (let j = 0; j < size; j++) {
        const t = y - offset + j;
        for (let i = 0; i < size; i++) {
          const s = x - offset + i;
          for (let color of colors) {
            // sum += 1 / pixel
            const tmp = matrix?.[t]?.[s]?.[color] ?? 0;
            sums[color] += tmp === 0 ? tmp : 1 / tmp;
          }
        }
      }

      for (let color of colors) {
        // Calculate harmonic mean
        // h = (m * n) / sum
        result[y][x][color] = Math.round(numberOfPixels / sums[color]);
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number]} */
  const [matrix, size] = evt.data;
  const result = harmonicMeanFilter(matrix, size);
  this.self.postMessage(result);
  this.self.close();
});
