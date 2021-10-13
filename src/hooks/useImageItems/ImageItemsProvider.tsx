import React, { useCallback, useEffect, useReducer } from "react";
import {
  imageDataToPixelMatrix,
  imageFileToImageData,
} from "src/utils/imageDataUtils";
import { grayLevelResolution as glResolution } from "src/utils/grayLevelResolution";
import { bitPlanesRemoving as bpRemoving } from "src/utils/bitPlanesRemoving";
import { histogramEqualization as hEqualization } from "src/utils/histogramEqualization";

import useMessages from "src/hooks/useMessages";

import { imageItemsContext } from "./useImageItems";
import useSpatialResolution from "./useSpatialResolution";
import useSpatialFilter from "./useSpatialFilter";
import useNoiseDistribution from "./useNoiseDistribution";

import {
  ImageItemsState,
  ImageItemsAction,
  OriginalItem,
  GrayLevelResolutionParams,
  HistogramEqualizationParams,
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

  const spatialResolution = useSpatialResolution(state, dispatch);
  const spatialFilter = useSpatialFilter(state, dispatch);
  const noiseDistribution = useNoiseDistribution(state, dispatch);

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
        filename: file.name,
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

  return (
    <imageItemsContext.Provider
      value={{
        state,
        initialize,
        popItem,
        addOriginalImage,
        /** Spatial Resolution */
        ...spatialResolution,

        grayLevelResolution,
        bitPlanesRemoving,
        histogramEqualization,
        /** Spatial Filter */
        ...spatialFilter,
        ...noiseDistribution,
      }}
    >
      {children}
    </imageItemsContext.Provider>
  );
};

export default ImageItemsProvider;
