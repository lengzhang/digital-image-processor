/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/**
 * Smoothing Filter
 * @param {Pixel[][]} matrix
 */
const highBoostingFilter = (matrix) => {
  return matrix;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix] = evt.data;
  const result = highBoostingFilter(matrix);
  this.self.postMessage(result);
  this.self.close();
});
