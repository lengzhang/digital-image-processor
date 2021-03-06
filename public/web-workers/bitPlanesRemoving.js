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
 * Bit Planes Removing
 * @param {Pixel[][]} matrix
 * @param {number} bits
 */
const bitPlanesRemoving = (matrix, bits) => {
  const bitList = bits
    .toString(2)
    .split("")
    .reverse()
    .reduce((acc, v, i) => {
      if (v === "1") return [...acc, i + 1];
      return acc;
    }, []);

  return matrix.map((row) =>
    row.map((pixel) => {
      const newPixel = { R: 0, G: 0, B: 0, A: pixel.A };
      if (bitList.length === 0) return newPixel;

      if (bitList.length === 1) {
        const n = bitList[0];
        const bit = Math.pow(2, n - 1);

        for (let color of colors) {
          newPixel[color] = calculateBitPlane(pixel[color], bit);
        }
      } else if (bitList.length > 1) {
        for (let n of bitList) {
          const bit = Math.pow(2, n - 1);
          for (let color of colors) {
            newPixel[color] = calculateBitPlane(pixel[color], bit, bit);
          }
        }
      }

      return newPixel;
    })
  );
};

/**
 * Calculate nth plane color
 * @param {number} color
 * @param {number} bit
 * @param {number} x
 * @returns
 */
const calculateBitPlane = (color, bit, x = 255) => {
  const value = color & bit;
  return value === bit ? x : 0;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, bits] = evt.data;
  const result = bitPlanesRemoving(matrix, bits);
  this.self.postMessage(result);
  this.self.close();
});
