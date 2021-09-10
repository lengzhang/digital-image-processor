/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/**
 * Calculate gray level value for each pixel
 * @param {Pixel[][]} matrix
 * @param {8 | 7 | 6 | 5 | 4 | 3 | 2 | 1} bit
 */
const grayLevelResolution = (matrix, bit) => {
  const level = Math.pow(2, bit);
  // Calculate Gray
  return matrix.map((row) => row.map((pixel) => calculateGray(pixel, level)));
};

/**
 * Calculate gray level value for the pixel
 * @param {Pixel} pixel
 * @param {number} level
 * @returns
 */
const calculateGray = (pixel, level) => {
  let gray = Math.pow(
    (Math.pow(pixel.R, 2.2) + Math.pow(pixel.G, 2.2) + Math.pow(pixel.B, 2.2)) /
      (1 + Math.pow(1.5, 2.2) + Math.pow(0.6, 2.2)),
    1 / 2.2
  );

  /** Quantize gray level value when target level is not 8-bit */
  if (level !== 256) gray = quantize(gray, level);

  return { ...pixel, R: gray, G: gray, B: gray };
};

/**
 * Match gray level value to 8-bit
 * @param {number} gray
 * @param {number} level
 * @returns {number}
 */
const quantize = (gray, level) => {
  const gap = Math.floor(256 / (level - 1));
  const ratio = ((gray + 1) / 256) * (level - 1);
  return Math.round(ratio) * gap;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, bit] = evt.data;
  const result = grayLevelResolution(matrix, bit);
  this.self.postMessage(result);
  this.self.close();
});
