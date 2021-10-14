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
 * Median Filter
 * @param {Pixel[][]} matrix
 * @param {number} size   // Kernel size
 */
const medianFilter = (matrix, size) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const offset = Math.floor(size / 2);
  const mid = Math.floor((size * size) / 2);

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
        // Sort and assign the midian
        list[color].sort((a, b) => a - b);
        result[y][x][color] = list[color][mid];
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, size] = evt.data;
  const result = medianFilter(matrix, size);
  this.self.postMessage(result);
  this.self.close();
});
