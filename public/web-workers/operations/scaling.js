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
 * Scaling value to the range from 0 to 255
 * @param {Pixel[][]} matrix
 * @returns {Pixel[][]}
 */
const scaling = (matrix) => {
  const col = matrix.length;
  const row = matrix[0].length;
  // Get min value
  const minSet = { R: Infinity, G: Infinity, B: Infinity };
  for (let j = 0; j < col; j++) {
    for (let i = 0; i < row; i++) {
      for (let color of colors) {
        minSet[color] = Math.min(minSet[color], matrix[j][i][color]);
      }
    }
  }

  // source = source - minValue
  for (let j = 0; j < col; j++) {
    for (let i = 0; i < row; i++) {
      for (let color of colors) {
        matrix[j][i][color] -= minSet[color];
      }
    }
  }

  // Get max value
  const maxSet = { R: -Infinity, G: -Infinity, B: -Infinity };
  for (let j = 0; j < col; j++) {
    for (let i = 0; i < row; i++) {
      for (let color of colors) {
        maxSet[color] = Math.max(maxSet[color], matrix[j][i][color]);
      }
    }
  }

  // source = source * 255 / maxValue
  for (let j = 0; j < col; j++) {
    for (let i = 0; i < row; i++) {
      for (let color of colors) {
        matrix[j][i][color] = Math.round(
          (matrix[j][i][color] * 255) / maxSet[color]
        );
      }
    }
  }

  return matrix;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][]]} */
  const [matrix] = evt.data;
  const result = scaling(matrix);
  this.self.postMessage(result);
  this.self.close();
});
