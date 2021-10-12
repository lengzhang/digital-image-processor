import { useCallback } from "react";

import useMessages from "../useMessages";
import * as noiseDistributions from "src/utils/noiseDistributions";

import {
  ImageItemsDispatch,
  ImageItemsState,
  DefaultItemProperties,
} from "./types";

export type NoiseDistributionItem = (DefaultItemProperties & {
  type: "noise-distribution";
}) &
  (
    | {
        method: "noise-distribution-gaussian";
        mean: number;
        sigma: number;
        k: number;
      }
    | {
        method: "noise-distribution-poisson";
      }
    | {
        method: "noise-distribution-salt-and-pepper";
      }
    | {
        method: "noise-distribution-speckle";
      }
  );
export const noiseDistributionMethods: NoiseDistributionItem["method"][] = [
  "noise-distribution-gaussian",
  "noise-distribution-poisson",
  "noise-distribution-salt-and-pepper",
  "noise-distribution-speckle",
];

export interface GaussianNoiseDistributionParams {
  source: number;
  mean: number;
  sigma: number;
  k: number;
}

const useNoiseDistribution = (
  state: ImageItemsState,
  dispatch: ImageItemsDispatch
) => {
  const { pushMessage } = useMessages();

  const gaussianNoiseDistribution = useCallback(
    async ({ source, mean, sigma, k }: GaussianNoiseDistributionParams) => {
      try {
        dispatch({
          type: "set-status",
          status: "noise-distribution-gaussian",
        });
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        const matrix = await noiseDistributions.gaussianNoiseDistribution(
          sourceItem.matrix,
          mean,
          sigma,
          k
        );
        dispatch({
          type: "push-item",
          item: {
            type: "noise-distribution",
            method: "noise-distribution-gaussian",
            matrix,
            mean,
            sigma,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            source,
            k,
          },
        });
        pushMessage({
          message: "Calculating gaussian noise distribution succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error:
            error?.message ?? "Calculating gaussian noise distribution failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  return { gaussianNoiseDistribution };
};

export default useNoiseDistribution;
