import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

const NEAREST_NEIGHBOR_INTERPOLATION_WORKER =
  "/web-workers/nearestNeighborInterpolation.js";
const BILINEAR_INTERPOLATION_WORKER = "/web-workers/bilinearInterpolation.js";
const LINEAR_INTERPOLATION_WORKER = "/web-workers/bilinearInterpolation.js";

export const nearestNeighborInterpolation = async (
  matrix: Pixel[][],
  destWidth: number,
  destHeight: number
) => {
  const result = await runImageProcessWorker(
    NEAREST_NEIGHBOR_INTERPOLATION_WORKER,
    matrix,
    destWidth,
    destHeight
  );
  return result;
};

export const bilinearInterpolation = async (
  matrix: Pixel[][],
  destWidth: number,
  destHeight: number
) => {
  const result = await runImageProcessWorker(
    BILINEAR_INTERPOLATION_WORKER,
    matrix,
    destWidth,
    destHeight
  );
  return result;
};

export const linearInterpolation = async (
  matrix: Pixel[][],
  destWidth: number,
  destHeight: number,
  coor: "x" | "y"
) => {
  const result = await runImageProcessWorker(
    LINEAR_INTERPOLATION_WORKER,
    matrix,
    destWidth,
    destHeight,
    coor
  );
  return result;
};
