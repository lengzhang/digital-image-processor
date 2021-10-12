import React, { useCallback, useEffect, useReducer } from "react";
import {
  imageDataToPixelMatrix,
  imageFileToImageData,
} from "src/utils/imageDataUtils";
import * as spatialResolution from "src/utils/spatialResolution";
import { grayLevelResolution as glResolution } from "src/utils/grayLevelResolution";
import { bitPlanesRemoving as bpRemoving } from "src/utils/bitPlanesRemoving";
import { histogramEqualization as hEqualization } from "src/utils/histogramEqualization";
import * as spatialFilterOperations from "src/utils/spatialFilteringOperations";

import useMessages from "src/hooks/useMessages";

import { imageItemsContext } from "./useImageItems";
import {
  ImageItem,
  ImageItemsState,
  ImageItemsAction,
  OriginalItem,
  SpatialResolutionParams,
  GrayLevelResolutionParams,
  HistogramEqualizationParams,
  SpatialFilteringParams,
  BitPlanesRemovingParams,
} from "./types";

const initialState: ImageItemsState = {
  status: "idle",
  items: [],
  error: "",
};

const reducer = (
  state: ImageItemsState,
  action: ImageItemsAction
): ImageItemsState => {
  switch (action.type) {
    case "initialize":
      state = { ...initialState };
      break;

    case "set-status":
      state = { ...state, status: action.status };
      break;

    case "pop-item":
      state.items.pop();
      state = { ...state, items: [...state.items] };
      break;

    case "set-error":
      state = { ...state, error: action.error };
      break;

    case "push-item":
      state = { ...state, items: [...state.items, action.item] };
      break;
  }

  return state;
};

const ImageItemsProvider: React.FC = ({ children }) => {
  const { pushMessage } = useMessages();
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    if (!!state.error) {
      pushMessage({ message: state.error, severity: "error" });
      dispatch({ type: "set-error", error: initialState.error });
    }
  }, [state.error, pushMessage, dispatch]);

  const initialize = () => {
    dispatch({ type: "initialize" });
  };

  const popItem = () => {
    dispatch({ type: "pop-item" });
  };

  const addOriginalImage = async (file: File) => {
    dispatch({ type: "set-status", status: "setting-original-file" });
    try {
      const imageData = await imageFileToImageData(file);
      const [matrix, isGrayScaled] = await imageDataToPixelMatrix(imageData);
      const item: OriginalItem = {
        type: "original",
        matrix,
        source: null,
        bit: 8,
        isGrayScaled,
      };
      dispatch({ type: "push-item", item });
      pushMessage({ message: "Added original image", severity: "success" });
    } catch (error: any) {
      dispatch({
        type: "set-error",
        error: error?.message ?? "Adding original image faile",
      });
    }
    dispatch({ type: "set-status", status: "idle" });
  };

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
    [state.items, pushMessage]
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
    [state.items, pushMessage]
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
    [state.items, pushMessage]
  );

  /** Gray Level Resolution */
  const grayLevelResolution = useCallback(
    async ({ source, bit = 8 }: GrayLevelResolutionParams) => {
      try {
        dispatch({ type: "set-status", status: "gray-level-resolution" });
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const matrix = await glResolution(items[source].matrix, bit);

        dispatch({
          type: "push-item",
          item: {
            type: "gray-level-resolution",
            matrix,
            source,
            bit,
            isGrayScaled: true,
          },
        });
        pushMessage({
          message: "Calculating gray level resolution succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating gray level resolution failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, pushMessage]
  );

  /** Bit Planes Removing */
  const bitPlanesRemoving = useCallback(
    async ({ source, bits }: BitPlanesRemovingParams) => {
      try {
        dispatch({ type: "set-status", status: "bit-planes-removing" });
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        if (Number.isNaN(bits)) bits = Math.pow(2, sourceItem.bit) - 1;

        const matrix = await bpRemoving(sourceItem.matrix, bits);

        dispatch({
          type: "push-item",
          item: {
            type: "bit-planes-removing",
            matrix,
            source,
            bit: sourceItem.bit,
            bits,
            isGrayScaled: sourceItem.isGrayScaled,
          },
        });
        pushMessage({
          message: "Calculating bit planes removing succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating bit planes removing failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, pushMessage]
  );

  /** Histogram Equalization */
  const histogramEqualization = useCallback(
    async ({ source, size }: HistogramEqualizationParams) => {
      try {
        dispatch({ type: "set-status", status: "histogram-equalization" });
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        const matrix = await hEqualization(sourceItem.matrix, size);

        dispatch({
          type: "push-item",
          item: {
            type: "histogram-equalization",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            heMode: size === undefined ? "Global" : `Local ${size} x ${size}`,
          },
        });
        pushMessage({
          message: "Calculating histogram equalization succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating histogram equalization failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, pushMessage]
  );

  /** Spatial Filtering */
  const spatialFiltering = useCallback(
    async ({
      source,
      method,
      size,
      /** Smoothing Filter */
      K,
      sigma,
      /** Sharpening Laplacian Filter */
      maskMode,
      processMode = "none",
      /** High-boosting Filter */
      blurredImage = 0,
      highBoostingK,
    }: SpatialFilteringParams) => {
      try {
        dispatch({ type: "set-status", status: "spatial-filtering" });
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        let item: ImageItem | null = null;
        if (method === "gaussian-smoothing-filter") {
          if (typeof K !== "number") throw new Error("K is invalid");
          if (typeof sigma !== "number") throw new Error("Sigma is invalid");
          const matrix = await spatialFilterOperations.gaussianSmoothingFilter(
            sourceItem.matrix,
            size,
            K,
            sigma
          );
          item = {
            type: "spatial-filtering",
            method: "gaussian-smoothing-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
            K,
            sigma,
          };
        } else if (method === "median-filter") {
          const matrix = await spatialFilterOperations.medianFilter(
            sourceItem.matrix,
            size
          );
          item = {
            type: "spatial-filtering",
            method: "median-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
          };
        } else if (method === "sharpening-laplacian-filter") {
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
          const matrix =
            await spatialFilterOperations.sharpeningLaplacianFilter(
              sourceItem.matrix,
              maskMode,
              processMode
            );
          item = {
            type: "spatial-filtering",
            method: "sharpening-laplacian-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            maskMode,
            processMode,
          };
        } else if (method === "high-boosting-filter") {
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
          item = {
            type: "spatial-filtering",
            method: "high-boosting-filter",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            blurredImage,
            highBoostingK,
          };
        }

        if (item === null)
          throw new Error("Spatial filtering method is invalid.");

        dispatch({ type: "push-item", item });
        pushMessage({
          message: "Calculating spatial filtering succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating spatial filtering faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, pushMessage]
  );

  return (
    <imageItemsContext.Provider
      value={{
        state,
        initialize,
        popItem,
        addOriginalImage,
        nearestNeighborInterpolation,
        linearInterpolation,
        bilinearInterpolation,
        grayLevelResolution,
        bitPlanesRemoving,
        histogramEqualization,
        spatialFiltering,
      }}
    >
      {children}
    </imageItemsContext.Provider>
  );
};

export default ImageItemsProvider;
