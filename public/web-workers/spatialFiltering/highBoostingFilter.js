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
 * High-boosting Filter
 * g_mask(x, y) = f(x, y) - f_bluured(x, y)
 * g(x, y) = f(x, y) + k * g_mask(x, y)
 *         = f(x, y) + k * (f(x, y) - f_bluured(x, y))
 *         = f(x, y) + k * f(x, y) - k * f_bluured(x, y)
 *         = (1 + k) * f(x, y) - k * f_bluured(x, y)
 * @param {Pixel[][]} matrix
 * @param {Pixel[][]} blurredMatrix
 * @param {number} k
 */
const highBoostingFilter = (matrix, blurredMatrix, k) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const result = matrix.map((row) => row.map((pixel) => ({ ...pixel })));

  for (let j = 0; j < col; j++) {
    for (let i = 0; i < row; i++) {
      for (let color of colors) {
        result[j][i][color] =
          (1 + k) * matrix[j][i][color] - k * blurredMatrix[j][i][color];
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], [Pixel[][], number]} */
  const [matrix, blurredMatrix, k] = evt.data;

  if (
    matrix.length !== blurredMatrix.length ||
    matrix[0].length !== blurredMatrix[0].length
  ) {
    throw new Error("Blurred image size doesn's match source image size.");
  }

  const result = highBoostingFilter(matrix, blurredMatrix, k);
  this.self.postMessage(result);
  this.self.close();
});
