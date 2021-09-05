import { useCallback, useEffect, useReducer } from "react";
import { removeDashAndUppercaseFirstLetter } from "src/utils";
import { nearestNeighborInterpolation } from "src/utils/nearestNeighborInterpolation";
import { linearInterpolation } from "src/utils/linearInterpolation";
import { bilinearInterpolation } from "src/utils/bilinearInterpolation";
import { BitType, grayLevelResolution } from "src/utils/grayLevelResolution";
import {
  imageDataToPixelMatrix,
  pixelMatrixToImageData,
} from "src/utils/imageDataUtils";

import {
  UseControllerProps,
  State,
  Action,
  MethodType,
  SpatialAlgorithm,
} from "./types";

export const methodTypes: MethodType[] = [
  "",
  "spatial-resolution",
  "gray-level-resolution",
];

export const spatialAlgorithms: SpatialAlgorithm[] = [
  "nearest-neighbor-interpolation",
  "linear-inerpolation",
  "bilinear-interpolation",
];

const initialState: State = {
  status: "idle",
  source: 0,
  methodType: "",
  /** Spatial Resolution */
  spatialAlgorithm: "nearest-neighbor-interpolation",
  width: "",
  height: "",
  /** Gray Level Resolution */
  bit: 8,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "initialize":
      state = { ...initialState, ...action.payload };
      break;

    case "change-source":
      state = { ...state, source: action.payload };
      break;

    case "change-method-type":
      state = { ...state, methodType: action.methodType };
      break;

    case "change-spatial-algorithm":
      state = { ...state, spatialAlgorithm: action.payload };
      break;

    case "change-width":
      state = { ...state, width: action.payload };
      break;

    case "change-height":
      state = { ...state, height: action.payload };
      break;

    case "change-bit":
      state = { ...state, bit: action.payload };
      break;
  }
  return state;
};

const useController = ({ items, addItem }: UseControllerProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: "initialize",
      payload: { source: Math.max(items.length - 1, 0) },
    });
  }, [items]);

  const onChangeMethodType: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    event.preventDefault();
    dispatch({
      type: "change-method-type",
      methodType: event.target.value as MethodType,
    });
  };

  const onChangeTextField =
    (
      type: "source" | "width" | "height" | "bit" | "spatial-algorithm"
    ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
    (event) => {
      event.preventDefault();
      if (type === "source") {
        dispatch({
          type: `change-${type}`,
          payload: parseInt(event.target.value) as number,
        });
      } else if (type === "bit") {
        dispatch({
          type: `change-${type}`,
          payload: parseInt(event.target.value) as BitType,
        });
      } else if (type === "spatial-algorithm") {
        dispatch({
          type: `change-${type}`,
          payload: event.target.value as SpatialAlgorithm,
        });
      } else {
        dispatch({ type: `change-${type}`, payload: event.target.value });
      }
    };

  const onClickAdd = useCallback(async () => {
    if (state.methodType === "" || state.status === "loading") return;

    dispatch({ type: "set-status", status: "loading" });

    const item = items[state.source];
    const matrix = imageDataToPixelMatrix(item.imageData);

    let title = "",
      imageData: ImageData | null = null;

    if (state.methodType === "spatial-resolution") {
      title = `${removeDashAndUppercaseFirstLetter(
        state.methodType
      )}: ${removeDashAndUppercaseFirstLetter(state.spatialAlgorithm)} (${
        state.width
      } x ${state.height})`;
      const result =
        state.spatialAlgorithm === "nearest-neighbor-interpolation"
          ? nearestNeighborInterpolation(
              matrix,
              parseInt(state.width),
              parseInt(state.height)
            )
          : state.spatialAlgorithm === "linear-inerpolation"
          ? linearInterpolation(
              matrix,
              parseInt(state.width),
              parseInt(state.height)
            )
          : bilinearInterpolation(
              matrix,
              parseInt(state.width),
              parseInt(state.height)
            );
      imageData = pixelMatrixToImageData(result);
    } else if (state.methodType === "gray-level-resolution") {
      title = `${removeDashAndUppercaseFirstLetter(state.methodType)}: ${
        state.bit
      }-bit`;
      const result = grayLevelResolution(matrix, state.bit);
      imageData = pixelMatrixToImageData(result);
    }

    if (!!title && !!imageData)
      addItem({
        title: `[${items.length}] ${title}`,
        subheader: `Source: ${state.source === 0 ? "Origin" : state.source}`,
        imageData,
      });

    dispatch({ type: "set-status", status: "idle" });
  }, [state, items, addItem]);

  return {
    state,
    isAddable:
      (state.methodType === "spatial-resolution" &&
        !!state.width &&
        !!state.height) ||
      (state.methodType === "gray-level-resolution" && !!state.bit),
    onChangeMethodType,
    onChangeTextField,
    onClickAdd,
  };
};

export default useController;
