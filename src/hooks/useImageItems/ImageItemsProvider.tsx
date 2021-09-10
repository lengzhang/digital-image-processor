import React, { useCallback, useReducer } from "react";
import {
  imageDataToPixelMatrix,
  imageFileToImageData,
} from "src/utils/imageDataUtils";
import * as spatialResolution from "src/utils/spatialResolution";
import { grayLevelResolution as glResolution } from "src/utils/grayLevelResolution";

import { imageItemsContext } from "./context";
import {
  SpatialResolutionParams,
  ImageItemsState,
  ImageItemsAction,
  OriginalItem,
  GrayLevelResolutionParams,
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
    const item: OriginalItem = { type: "original", matrix, source: null };
    dispatch({ type: "push-item", item });
  };

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

        const matrix = await spatialResolution.nearestNeighborInterpolation(
          items[params.source].matrix,
          params.width,
          params.height
        );

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-resolution",
            method: "nearest-neighbor-interpolation",
            matrix,
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

        const matrix = await spatialResolution.linearInterpolation(
          items[params.source].matrix,
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

        dispatch({
          type: "push-item",
          item: {
            type: "spatial-resolution",
            method: "bilinear-interpolation",
            matrix,
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
          item: { type: "gray-level-resolution", matrix, source, bit },
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
      }}
    >
      {children}
    </imageItemsContext.Provider>
  );
};

export default ImageItemsProvider;
