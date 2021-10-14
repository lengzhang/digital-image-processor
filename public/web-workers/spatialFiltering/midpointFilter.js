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
 * Midpoint Filter
 * @param {Pixel[][]} matrix
 * @param {number} size   // Kernel size
 */
const midpointFilter = (matrix, size) => {
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
        // Sort, calculate, and assign the midpoint
        list[color].sort((a, b) => a - b);
        const min = list[color][0];
        const max = list[color][numberOfPixels - 1];
        result[y][x][color] = Math.round((max - min) / 2);
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, size] = evt.data;
  const result = midpointFilter(matrix, size);
  this.self.postMessage(result);
  this.self.close();
});
