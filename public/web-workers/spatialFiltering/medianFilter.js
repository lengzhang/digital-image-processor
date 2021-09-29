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
const medianFilter = (matrix) => {
  return matrix;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix] = evt.data;
  const result = medianFilter(matrix);
  this.self.postMessage(result);
  this.self.close();
});
