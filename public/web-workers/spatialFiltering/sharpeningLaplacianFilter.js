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
const sharpeningLaplacianFilter = (matrix) => {
  return matrix;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix] = evt.data;
  const result = sharpeningLaplacianFilter(matrix);
  this.self.postMessage(result);
  this.self.close();
});
