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
 * Subtraction Operation
 * @param {Pixel[][]} a
 * @param {Pixel[][]} b
 */
const subtraction = (a, b) => {
  const m = a.length;
  const n = a[0].length;

  /** @type {Pixel[][]} */
  const result = a.map((row) => row.map((pixel) => ({ ...pixel })));

  for (let y = 0; y < m; y++) {
    for (let x = 0; x < n; x++) {
      for (let color of colors) {
        result[y][x][color] = a[y][x][color] - b[y][x][color];
      }
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], Pixel[]]} */
  const [a, b] = evt.data;
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error("Matrixs' size should be equivalence.");
  }
  const result = subtraction(a, b);
  this.self.postMessage(result);
  this.self.close();
});
