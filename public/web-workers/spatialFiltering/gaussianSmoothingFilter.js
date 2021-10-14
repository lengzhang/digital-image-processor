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
 * Generate gaussian mask
 * G(x, y) = K * e^(-(x^2 + y^2) / (2σ^2))
 * @param {number} size   // Kernel size
 * @param {number} K
 * @param {number} sigma  // σ
 * @returns {[number[][], number]}
 */
const generateGaussianTemplate = (size, K, sigma) => {
  /**
   * @type {number[][]}
   */
  const template = Array.from({ length: size }).map(() =>
    Array.from({ length: size }).fill(0)
  );

  const offset = Math.floor(size / 2);
  const sigma2 = sigma * sigma;

  for (let j = 0; j < size; j++) {
    const x2 = Math.pow(j - offset, 2); // x^2
    for (let i = 0; i < size; i++) {
      const y2 = Math.pow(i - offset, 2); // y^2
      const a = Math.exp(-(x2 + y2) / (2 * sigma2)); // e^(-(x^2 + y^2) / (2σ^2))
      template[j][i] = K * a;
    }
  }

  // Normalize the mask by template[0][0]
  const n = template[0][0];
  let sum = 0;

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      template[j][i] = Math.floor(template[j][i] / n);
      sum += template[j][i];
    }
  }

  return [template, sum];
};

/**
 * Gaussian Smoothing Filter
 * @param {Pixel[][]} matrix
 * @param {number[][]} mask
 * @param {number} maskSum
 */
const gaussianSmoothingFilter = (matrix, mask, maskSum) => {
  const col = matrix.length;
  const row = matrix[0].length;
  const offset = Math.floor(mask.length / 2);

  const result = matrix.map((row) => row.map((pixel) => ({ ...pixel })));

  /**
   * Loop for center pixel
   */
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      const sum = { R: 0, G: 0, B: 0 };
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
      for (let color of colors)
        result[y][x][color] = Math.round(sum[color] / maskSum);
    }
  }

  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number]} */
  const [matrix, size, K, sigma] = evt.data;
  const [mask, sum] = generateGaussianTemplate(size, K, sigma);
  const result = gaussianSmoothingFilter(matrix, mask, sum);
  this.self.postMessage(result);
  this.self.close();
});
