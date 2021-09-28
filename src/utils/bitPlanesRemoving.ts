import { Pixel } from "./imageDataUtils";
import runImageProcessWorker from "./runImageProcessWorker";

const BIT_PLANES_REMOVING_WORKER = "/web-workers/bitPlanesRemoving.js";

export const bitPlanesRemoving = async (matrix: Pixel[][], bits: number) => {
  const result = await runImageProcessWorker(
    BIT_PLANES_REMOVING_WORKER,
    matrix,
    bits
  );
  return result;
};
