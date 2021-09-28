import React, { useCallback, useReducer } from "react";
import {
  imageDataToPixelMatrix,
  imageFileToImageData,
} from "src/utils/imageDataUtils";
import * as spatialResolution from "src/utils/spatialResolution";
import { grayLevelResolution as glResolution } from "src/utils/grayLevelResolution";
import { bitPlanesRemoving as bpRemoving } from "src/utils/bitPlanesRemoving";

import { imageItemsContext } from "./context";
import {
  SpatialResolutionParams,
  ImageItemsState,
  ImageItemsAction,
  OriginalItem,
  GrayLevelResolutionParams,
} from "./types";
import { BitPlanesRemovingParams } from "./types";

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
      }}
    >
      {children}
    </imageItemsContext.Provider>
  );
};

export default ImageItemsProvider;
