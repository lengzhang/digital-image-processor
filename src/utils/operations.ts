import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

const OPERATIONS_ADDITION_WORKER = "/web-workers/operations/addition.js";
const OPERATIONS_SUBTRACTION_WORKER = "/web-workers/operations/subtraction.js";
const OPERATIONS_SCALING_WORKER = "/web-workers/operations/scaling.js";

export const addition = async (a: Pixel[][], b: Pixel[][]) => {
  const result = await runImageProcessWorker(OPERATIONS_ADDITION_WORKER, a, b);
  return result;
};

export const subtraction = async (a: Pixel[][], b: Pixel[][]) => {
  const result = await runImageProcessWorker(
    OPERATIONS_SUBTRACTION_WORKER,
    a,
    b
  );
  return result;
};

export const scaling = async (matrix: Pixel[][]) => {
  const result = await runImageProcessWorker(OPERATIONS_SCALING_WORKER, matrix);
  return result;
};
