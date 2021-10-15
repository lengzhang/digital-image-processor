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
 * Geometric Mean Filter
 * @param {Pixel[][]} matrix
 * @param {number} size   // Kernel size
 */
const geometricMeanFilter = (matrix, size) => {
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
      let hasZero = false;
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
            let tmp = matrix?.[t]?.[s]?.[color] ?? 0;
            if (tmp === 0) hasZero = true;
            list[color].push(tmp);
          }
        }
      }

      /**
       * Handling Zeros In Geometric Mean Calculation
       * https://www.wwdmag.com/channel/casestudies/handling-zeros-geometric-mean-calculation
       */
      for (let color of colors) {
        // Calculate geometric mean
        // g = product ^ (1 / (m * n))
        const c = hasZero ? 1 : 0;

        const n = list[color].length;
        const sum = list[color].reduce((p, v) => p + Math.log(v + c), 0);
        let g = sum / n;
        g = Math.pow(10, g) - c;

        result[y][x][color] = Math.round(g);
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
