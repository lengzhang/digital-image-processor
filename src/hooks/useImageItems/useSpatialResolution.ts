import { useCallback } from "react";

import useMessages from "src/hooks/useMessages";
import * as spatialResolution from "src/utils/spatialResolution";

import { ImageItemsDispatch, ImageItemsState } from "./types";

/** Spatial Resolution */
export interface SpatialResolutionParams {
  source: number;
  width: number;
  height: number;
}

const useSpatialResolution = (
  state: ImageItemsState,
  dispatch: ImageItemsDispatch
) => {
  const { pushMessage } = useMessages();

  /** Nearest Neighbor Interpolation */
  const nearestNeighborInterpolation = useCallback(
    async (params: SpatialResolutionParams) => {
      try {
        dispatch({
          type: "set-status",
          status: "nearest-neighbor-interpolation",
        });
        const items = state.items;
        if (params.source < 0 || params.source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[params.source];

        const matrix = await spatialResolution.nearestNeighborInterpolation(
          sourceItem.matrix,
          params.width,
          params.height
        );

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-resolution",
            method: "nearest-neighbor-interpolation",
            matrix,
            bit: sourceItem.bit,
            isGrayScaled: false,
            ...params,
          },
        });
        pushMessage({
          message: "Calculating nearest neighbor interpolation succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error:
            error?.message ??
            "Calculating nearest neighbor interpolation failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  /** Linear Interpolation */
  const linearInterpolation = useCallback(
    (coor: "x" | "y") => async (params: SpatialResolutionParams) => {
      try {
        dispatch({
          type: "set-status",
          status: `linear-interpolation-${coor}`,
        });
        const items = state.items;
        if (params.source < 0 || params.source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[params.source];

        const matrix = await spatialResolution.linearInterpolation(
          sourceItem.matrix,
          params.width,
          params.height,
          coor
        );

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-resolution",
            method: `linear-interpolation-${coor}`,
            matrix,
            bit: sourceItem.bit,
            isGrayScaled: false,
            ...params,
          },
        });
        pushMessage({
          message: "Calculating linear interpolation succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating linear interpolation failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  /** Bilinear Interpolation */
  const bilinearInterpolation = useCallback(
    async (params: SpatialResolutionParams) => {
      try {
        dispatch({ type: "set-status", status: "bilinear-interpolation" });
        const items = state.items;
        if (params.source < 0 || params.source >= items.length) {
          throw new Error("source index is out of range");
        }

        const matrix = await spatialResolution.bilinearInterpolation(
          items[params.source].matrix,
          params.width,
          params.height
        );

        const sourceItem = items[params.source];

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-resolution",
            method: "bilinear-interpolation",
            matrix,
            bit: sourceItem.bit,
            isGrayScaled: false,
            ...params,
          },
        });
        pushMessage({
          message: "Calculating bilinear interpolation succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating bilinear interpolation failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  return {
    nearestNeighborInterpolation,
    linearInterpolation,
    bilinearInterpolation,
  };
};

export default useSpatialResolution;
