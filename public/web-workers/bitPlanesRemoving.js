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
    row.map(({ R, G, B, A }) => {
      const newPixel = { R: 0, G: 0, B: 0, A };
      if (bitList.length === 0) return newPixel;

      if (bitList.length === 1) {
        const n = bitList[0];
        const bit = Math.pow(2, n - 1);
        newPixel.R = calculateBitPlane(R, bit);
        newPixel.G = calculateBitPlane(G, bit);
        newPixel.B = calculateBitPlane(B, bit);
      } else if (bitList.length > 1) {
        for (let n of bitList) {
          const bit = Math.pow(2, n - 1);
          newPixel.R += calculateBitPlane(R, bit, bit);
          newPixel.G += calculateBitPlane(G, bit, bit);
          newPixel.B += calculateBitPlane(B, bit, bit);
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
