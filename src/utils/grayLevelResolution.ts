import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

export type BitType = 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

const GRAY_LEVEL_RESOLUTION_WORKER = "/web-workers/grayLevelResolution.js";

export const grayLevelResolution = async (
  matrix: Pixel[][],
  bit: BitType = 8
) => {
  const result = await runImageProcessWorker(
    GRAY_LEVEL_RESOLUTION_WORKER,
    matrix,
    bit
  );
  return result;
};
