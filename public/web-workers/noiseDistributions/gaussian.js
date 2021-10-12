const colors = ["R", "G", "B"];
/**
 * getClip returns a number within the range
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const getClip = (x, min, max) => (x < min ? min : max < x ? max : x);

/**
 * @typedef Pixel
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
 */

/**
 *
 * @param {Pixel[][]} matrix
 * @param {number} mean
 * @param {number} sigma
 * @param {number} k
 */
const gaussianNoiseDistribution = (matrix, mean, sigma, k) => {
  let v1 = 0,
    v2 = 0,
    s = 0,
    phase = 0;
  const generateGaussianNoise = (mean, sigma) => {
    let x = 0;
    if (phase === 0) {
      do {
        const u1 = Math.random();
        const u2 = Math.random();
        v1 = 2 * u1 - 1;
        v2 = 2 * u2 - 1;
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      x = v1 * Math.sqrt((-2 * Math.log(s)) / s);
    } else {
      x = v2 * Math.sqrt((-2 * Math.log(s)) / s);
    }
    phase = 1 - phase;
    return mean + sigma * x;
  };

  const col = matrix.length;
  const row = matrix[0].length;
  const result = matrix.map((row) => row.map((pixel) => ({ ...pixel })));

  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      for (let color of colors) {
        let tmp = matrix[y][x][color] + k * generateGaussianNoise(mean, sigma);
        tmp = getClip(Math.round(tmp), 0, 255);
        result[y][x][color] = tmp;
      }
    }
  }
  return result;
};

this.self.addEventListener("message", (evt) => {
  /** @type {[Pixel[][], number, number, number]} */
  const [matrix, mean, sigma, k] = evt.data;
  const result = gaussianNoiseDistribution(matrix, mean, sigma, k);
  this.self.postMessage(result);
  this.self.close();
});
