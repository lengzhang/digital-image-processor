import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

const HISTOGRAM_EQUALIZATION_WORKER = "/web-workers/histogramEqualization.js";

export const histogramEqualization = async (
  matrix: Pixel[][],
  size?: number
) => {
  const result = await runImageProcessWorker(
    HISTOGRAM_EQUALIZATION_WORKER,
    matrix,
    size
  );
  return result;
};
