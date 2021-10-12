import { Pixel } from "./imageDataUtils";

export const runWokrer = <T>(
  workerPath: string,
  ...params: any[]
): Promise<T> => {
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
    worker.postMessage(params);
  });
};

const runImageProcessWorker = async (
  workerPath: string,
  sourceMatrix: Pixel[][],
  ...params: any[]
): Promise<Pixel[][]> => {
  const result = await runWokrer<Pixel[][]>(
    workerPath,
    sourceMatrix,
    ...params
  );
  return result;
};

export default runImageProcessWorker;
