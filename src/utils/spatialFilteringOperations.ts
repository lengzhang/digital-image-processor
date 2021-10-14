import { SharpeningLaplacianMaskMode } from "src/hooks/useImageItems/useSpatialFilter";
import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

const ALPHA_TRIMMED_MEAN_FILTER =
  "/web-workers/spatialFiltering/alphaTrimmedMeanFilter.js";
const ARITHMETIC_MEAN_FILTER_WORKER =
  "/web-workers/spatialFiltering/arithmeticMeanFilter.js";
const CONTRAHARMONIC_MEAN_FILTER_WORKER =
  "/web-workers/spatialFiltering/contraharmonicMeanFilter.js";
const GAUSSIAN_SMOOTHING_FILTER_WORKER =
  "/web-workers/spatialFiltering/gaussianSmoothingFilter.js";
const GEOMETRIC_MEAN_FILTER_WORKER =
  "/web-workers/spatialFiltering/geometricMeanFilter.js";
const HARMONIC_MEAN_FILTER_WORKER =
  "/web-workers/spatialFiltering/harmonicMeanFilter.js";
const HIGH_BOOSTING_FILTER_WORKER =
  "/web-workers/spatialFiltering/highBoostingFilter.js";
const MEDIAN_FILTER_WORKER = "/web-workers/spatialFiltering/medianFilter.js";
const MAX_FILTER_WORKER = "/web-workers/spatialFiltering/maxFilter.js";
const MIN_FILTER_WORKER = "/web-workers/spatialFiltering/minFilter.js";
const MIDPOINT_FILTER_WORKER =
  "/web-workers/spatialFiltering/midpointFilter.js";
const SHARPENING_LAPLACIAN_FILTER_WORKER =
  "/web-workers/spatialFiltering/sharpeningLaplacianFilter.js";

export const alphaTrimmedMeanFilter = async (
  matrix: Pixel[][],
  size: number,
  d: number
) => {
  const result = await runImageProcessWorker(
    ALPHA_TRIMMED_MEAN_FILTER,
    matrix,
    size,
    d
  );
  return result;
};

export const arithmeticMeanFilter = async (matrix: Pixel[][], size: number) => {
  const result = await runImageProcessWorker(
    ARITHMETIC_MEAN_FILTER_WORKER,
    matrix,
    size
  );
  return result;
};

export const contraharmonicMeanFilter = async (
  matrix: Pixel[][],
  size: number,
  order: number
) => {
  const result = await runImageProcessWorker(
    CONTRAHARMONIC_MEAN_FILTER_WORKER,
    matrix,
    size,
    order
  );
  return result;
};

export const gaussianSmoothingFilter = async (
  matrix: Pixel[][],
  size: number,
  K: number,
  sigma: number
) => {
  const result = await runImageProcessWorker(
    GAUSSIAN_SMOOTHING_FILTER_WORKER,
    matrix,
    size,
    K,
    sigma
  );
  return result;
};

export const geometricMeanFilter = async (matrix: Pixel[][], size: number) => {
  const result = await runImageProcessWorker(
    GEOMETRIC_MEAN_FILTER_WORKER,
    matrix,
    size
  );
  return result;
};

export const harmonicMeanFilter = async (matrix: Pixel[][], size: number) => {
  const result = await runImageProcessWorker(
    HARMONIC_MEAN_FILTER_WORKER,
    matrix,
    size
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

export const maxFilter = async (matrix: Pixel[][], size: number) => {
  const result = await runImageProcessWorker(MAX_FILTER_WORKER, matrix, size);
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

export const midpointFilter = async (matrix: Pixel[][], size: number) => {
  const result = await runImageProcessWorker(
    MIDPOINT_FILTER_WORKER,
    matrix,
    size
  );
  return result;
};

export const minFilter = async (matrix: Pixel[][], size: number) => {
  const result = await runImageProcessWorker(MIN_FILTER_WORKER, matrix, size);
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
