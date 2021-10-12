import { SharpeningLaplacianMaskMode } from "src/hooks/useImageItems/useSpatialFilter";
import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

const SMOOTHING_FILTER_WORKER =
  "/web-workers/spatialFiltering/gaussianSmoothingFilter.js";
const MEDIAN_FILTER_WORKER = "/web-workers/spatialFiltering/medianFilter.js";
const SHARPENING_LAPLACIAN_FILTER_WORKER =
  "/web-workers/spatialFiltering/sharpeningLaplacianFilter.js";
const HIGH_BOOSTING_FILTER_WORKER =
  "/web-workers/spatialFiltering/highBoostingFilter.js";

export const gaussianSmoothingFilter = async (
  matrix: Pixel[][],
  size: number,
  K: number,
  sigma: number
) => {
  const result = await runImageProcessWorker(
    SMOOTHING_FILTER_WORKER,
    matrix,
    size,
    K,
    sigma
  );
  return result;
};

export const medianFilter = async (matrix: Pixel[][], size: number) => {
  const result = await runImageProcessWorker(
    MEDIAN_FILTER_WORKER,
    matrix,
    size
  );
  return result;
};

export const sharpeningLaplacianFilter = async (
  matrix: Pixel[][],
  maskMode: SharpeningLaplacianMaskMode,
  processMode: "none" | "scaled" | "sharpened"
) => {
  const result = await runImageProcessWorker(
    SHARPENING_LAPLACIAN_FILTER_WORKER,
    matrix,
    maskMode,
    processMode
  );
  return result;
};

export const highBoostingFilter = async (
  matrix: Pixel[][],
  blurredMatrix: Pixel[][],
  k: number
) => {
  const result = await runImageProcessWorker(
    HIGH_BOOSTING_FILTER_WORKER,
    matrix,
    blurredMatrix,
    k
  );
  return result;
};
