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
 * Arithmetic Mean Filter
 * @param {Pixel[][]} matrix
 * @param {number} size   // Kernel size
 * @param {number} d
 */
const alphaTrimmedMeanFilter = (matrix, size, d) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const offset = Math.floor(size / 2);
  const n = Math.floor(d / 2);

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
          for (let color of colors)
            list[color].push(matrix?.[t]?.[s]?.[color] ?? 0);
        }
      }

      for (let color of colors) {
        // Sort the list
        list[color].sort((a, b) => a - b);
        // Calculate sum without trimmed items
        let sum = 0;
        let count = 0;
        for (let i = n; i < list[color].length - n; i++) {
          sum += list[color][i];
          count++;
        }
        result[y][x][color] = Math.round(sum / count);
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, size, d] = evt.data;
  const result = alphaTrimmedMeanFilter(matrix, size, d);
  this.self.postMessage(result);
  this.self.close();
});
