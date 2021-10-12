import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

const GAUSSIAN_WORKER = "web-workers/noiseDistributions/gaussian.js";
export const gaussianNoiseDistribution = async (
  matrix: Pixel[][],
  mean: number,
  sigma: number,
  k: number
) => {
  const result = await runImageProcessWorker(
    GAUSSIAN_WORKER,
    matrix,
    mean,
    sigma,
    k
  );
  return result;
};
