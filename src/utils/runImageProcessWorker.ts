import { Pixel } from "./imageDataUtils";

const runImageProcessWorker = (
  workerPath: string,
  sourceMatrix: Pixel[][],
  ...params: any[]
): Promise<Pixel[][]> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath);
    worker.addEventListener("message", (event) => {
      resolve(event.data);
    });
    worker.addEventListener("error", (event) => {
      reject(event.error);
    });
    worker.addEventListener("messageerror", (event) => {
      reject(event.data);
    });
    worker.postMessage([sourceMatrix, ...params]);
  });
};

export default runImageProcessWorker;
