import { useCallback } from "react";

import useMessages from "src/hooks/useMessages";
import * as spatialFilterOperations from "src/utils/spatialFilteringOperations";
import { ImageItemsDispatch, ImageItemsState } from "../types";

import {
  GaussianSmotthingFilterParams,
  MedianFilterParams,
  SharpeningLaplacianFilterParams,
  HighBoostingFilterParams,
} from "./types";

const useSpatialFilter = (
  state: ImageItemsState,
  dispatch: ImageItemsDispatch
) => {
  const { pushMessage } = useMessages();

  const gaussianSmoothingFilter = useCallback(
    async ({ source, size, K, sigma }: GaussianSmotthingFilterParams) => {
      dispatch({ type: "set-status", status: "spatial-filtering" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];
        if (typeof K !== "number") throw new Error("K is invalid");
        if (typeof sigma !== "number") throw new Error("Sigma is invalid");
        const matrix = await spatialFilterOperations.gaussianSmoothingFilter(
          sourceItem.matrix,
          size,
          K,
          sigma
        );
        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method: "gaussian-smoothing-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
            K,
            sigma,
          },
        });
        pushMessage({
          message: "Calculating gaussian smoothing filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error:
            error?.message ?? "Calculating gaussian smoothing filtering failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const medianFilter = useCallback(
    async ({ source, size }: MedianFilterParams) => {
      dispatch({ type: "set-status", status: "spatial-filtering" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];
        const matrix = await spatialFilterOperations.medianFilter(
          sourceItem.matrix,
          size
        );
        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method: "median-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
          },
        });
        pushMessage({
          message: "Calculating median filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating median filtering failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const sharpeningLaplacianFilter = useCallback(
    async ({
      source,
      maskMode,
      processMode = "none",
    }: SharpeningLaplacianFilterParams) => {
      dispatch({ type: "set-status", status: "spatial-filtering" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        if (
          maskMode !== "mask-4" &&
          maskMode !== "mask-8" &&
          maskMode !== "mask-4-reverse" &&
          maskMode !== "mask-8-reverse"
        ) {
          throw new Error("Mask mode is invalid");
        }

        if (
          processMode !== "none" &&
          processMode !== "scaled" &&
          processMode !== "sharpened"
        ) {
          throw new Error("Process mode is invalid");
        }

        const matrix = await spatialFilterOperations.sharpeningLaplacianFilter(
          sourceItem.matrix,
          maskMode,
          processMode
        );

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method: "sharpening-laplacian-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            maskMode,
            processMode,
          },
        });
        pushMessage({
          message: "Calculating sharpening laplacian filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error:
            error?.message ??
            "Calculating sharpening laplacian filtering failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const highBoostingFilter = useCallback(
    async ({
      source,
      blurredImage = 0,
      highBoostingK,
    }: HighBoostingFilterParams) => {
      dispatch({ type: "set-status", status: "spatial-filtering" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        if (typeof highBoostingK !== "number")
          throw new Error("High-boosting A is invalid");

        if (blurredImage < 0 || blurredImage >= items.length) {
          throw new Error("Blurred image index is out of range");
        }

        const blurredItem = items[blurredImage];

        const matrix = await spatialFilterOperations.highBoostingFilter(
          sourceItem.matrix,
          blurredItem.matrix,
          highBoostingK
        );

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method: "high-boosting-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            blurredImage,
            highBoostingK,
          },
        });
        pushMessage({
          message: "Calculating sharpening laplacian filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error:
            error?.message ??
            "Calculating sharpening laplacian filtering failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const minFilter = useCallback(
    async ({ source, size }: MedianFilterParams) => {
      dispatch({ type: "set-status", status: "spatial-filtering" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];
        const matrix = await spatialFilterOperations.minFilter(
          sourceItem.matrix,
          size
        );
        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method: "min-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
          },
        });
        pushMessage({
          message: "Calculating min filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating min filtering failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const maxFilter = useCallback(
    async ({ source, size }: MedianFilterParams) => {
      dispatch({ type: "set-status", status: "spatial-filtering" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];
        const matrix = await spatialFilterOperations.maxFilter(
          sourceItem.matrix,
          size
        );
        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method: "max-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
          },
        });
        pushMessage({
          message: "Calculating max filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating max filtering failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const midpointFilter = useCallback(
    async ({ source, size }: MedianFilterParams) => {
      dispatch({ type: "set-status", status: "spatial-filtering" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];
        const matrix = await spatialFilterOperations.midpointFilter(
          sourceItem.matrix,
          size
        );
        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method: "midpoint-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
          },
        });
        pushMessage({
          message: "Calculating midpoint filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating midpoint filtering failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  return {
    gaussianSmoothingFilter,
    medianFilter,
    sharpeningLaplacianFilter,
    highBoostingFilter,
    minFilter,
    maxFilter,
    midpointFilter,
  };
};

export default useSpatialFilter;
