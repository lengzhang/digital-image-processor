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
 * @returns {Pixel[][]}
 */
const grayLevelResolution = (matrix, bit) => {
  /**
   * Get level from bit
   * 1-bit <=> 2^1=2 levels
   * 2-bit <=> 2^2=4 levels
   * 3-bit <=> 2^3=8 levels
   * 4-bit <=> 2^4=16 levels
   * 5-bit <=> 2^5=32 levels
   * 6-bit <=> 2^6=64 levels
   * 7-bit <=> 2^7=128 levels
   * 8-bit <=> 2^8=256 levels
   */
  const level = Math.pow(2, bit);
  // Calculate Gray
  return matrix.map((row) => row.map((pixel) => calculateGray(pixel, level)));
};

/**
 * Calculate gray level value for the pixel
 * @param {Pixel} pixel
 * @param {number} level
 * @returns {Pixel}
 */
const calculateGray = (pixel, level) => {
  /**
   * https://baike.baidu.com/item/%E7%81%B0%E5%BA%A6%E5%80%BC?fr=aladdin
   *
   * Gray = ((R^2.2 + (1.5 * G)^2.2 + (0.6 * B)^2.2) / (1 + 1.5^2.2 + 0.6^2.2)) ^ (1 / 2.2)
   */
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
 * Match gray level value to k-bit
 * @param {number} gray
 * @param {number} level
 * @returns {number}
 */
const quantize = (gray, level) => {
  // Gap between each level
  const gap = Math.floor(256 / (level - 1));
  // Calculate target gray level from gray
  const grayLevel = Math.round((gray + 1) / 256) * (level - 1);
  // Calculate gray value
  return grayLevel * gap;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, bit] = evt.data;
  const result = grayLevelResolution(matrix, bit);
  this.self.postMessage(result);
  this.self.close();
});
