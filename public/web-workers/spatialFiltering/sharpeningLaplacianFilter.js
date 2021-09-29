const colors = ["R", "G", "B"];

/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

const mask4 = [
  [0, 1, 0],
  [1, -4, 1],
  [0, 1, 0],
];
const mask8 = [
  [1, 1, 1],
  [1, -8, 1],
  [1, 1, 1],
];
const mask4Reverse = [
  [0, -1, 0],
  [-1, 4, -1],
  [0, -1, 0],
];
const mask8Reverse = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1],
];

/**
 * Smoothing Filter
 * @param {Pixel[][]} matrix
 * @param {number[][]} mask
 */
const sharpeningLaplacianFilter = (matrix, mask) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const offset = Math.floor(mask.length / 2);

  const result = matrix.map((row) => row.map((pixel) => ({ ...pixel })));

  /**
   * Loop for center pixel
   */
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      let sum = { R: 0, G: 0, B: 0 };
      /**
       * Loop for the mask
       * get the number of pixels of each level value
       */
      for (let j = 0; j < mask.length; j++) {
        const t = y - offset + j;
        for (let i = 0; i < mask.length; i++) {
          const s = x - offset + i;
          // If s and t are in range
          if (0 <= s && s < row && 0 <= t && t < col) {
            for (let color of colors)
              sum[color] += mask[j][i] * matrix[t][s][color];
          }
        }
      }
      for (let color of colors) result[y][x][color] = Math.round(sum[color]);
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, mode] = evt.data;
  const mask =
    mode === "mask-4"
      ? mask4
      : mode === "mask-8"
      ? mask8
      : mode === "mask-4-reverse"
      ? mask4Reverse
      : mode === "mask-8-reverse"
      ? mask8Reverse
      : null;
  if (mask === null) throw new Error("Mask mode is invalid");
  const result = sharpeningLaplacianFilter(matrix, mask);
  this.self.postMessage(result);
  this.self.close();
});
