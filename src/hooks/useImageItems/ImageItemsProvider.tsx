import React, { useCallback, useReducer } from "react";
import {
  imageDataToPixelMatrix,
  imageFileToImageData,
} from "src/utils/imageDataUtils";
import * as spatialResolution from "src/utils/spatialResolution";
import { grayLevelResolution as glResolution } from "src/utils/grayLevelResolution";
import { bitPlanesRemoving as bpRemoving } from "src/utils/bitPlanesRemoving";
import { histogramEqualization as hEqualization } from "src/utils/histogramEqualization";
import * as spatialFilterOperations from "src/utils/spatialFilteringOperations";

import { imageItemsContext } from "./context";
import {
  SpatialResolutionParams,
  ImageItemsState,
  ImageItemsAction,
  OriginalItem,
  GrayLevelResolutionParams,
  BitPlanesRemovingParams,
  HistogramEqualizationParams,
  SpatialFilteringParams,
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
      state.status = action.status;
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
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => {
    dispatch({ type: "initialize" });
  };

  const popItem = () => {
    dispatch({ type: "pop-item" });
  };

  const addOriginalImage = async (file: File) => {
    const imageData = await imageFileToImageData(file);
    const matrix = imageDataToPixelMatrix(imageData);
    const item: OriginalItem = {
      type: "original",
      matrix,
      source: null,
      bit: 8,
      isGrayScaled: false,
    };
    dispatch({ type: "push-item", item });
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
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error:
            error?.message ??
            "Calculating nearest neighbor interpolation faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items]
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
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating linear interpolation faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items]
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
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating bilinear interpolation faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items]
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
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating gray level resolution faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items]
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
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating bit planes removing faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items]
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
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating histogram equalization faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items]
  );

  /** Spatial Filtering */
  const spatialFiltering = useCallback(
    async ({
      source,
      method,
      size = 3,
      highBoostingA = 1,
      sigma = 1,
    }: SpatialFilteringParams) => {
      try {
        dispatch({ type: "set-status", status: "spatial-filtering" });
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        const matrix =
          method === "median-filter"
            ? await spatialFilterOperations.medianFilter(
                sourceItem.matrix,
                size
              )
            : method === "sharpening-laplacian-filter"
            ? await spatialFilterOperations.sharpeningLaplacianFilter(
                sourceItem.matrix,
                size
              )
            : method === "high-boosting-filter"
            ? await spatialFilterOperations.highBoostingFilter(
                sourceItem.matrix,
                size,
                highBoostingA
              )
            : // Smoothing filter
              await spatialFilterOperations.smoothingFilter(
                sourceItem.matrix,
                size,
                sigma
              );

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-filtering",
            method,
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            filterSize: size,
            highBoostingA,
            sigma,
          },
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating histogram equalization faile",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items]
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
