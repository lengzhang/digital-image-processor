import { useCallback, useEffect, useReducer } from "react";
import { bilinearInterpolation } from "src/utils/bilinearInterpolation";
import {
  imageDataToPixelMatrix,
  pixelMatrixToImageData,
} from "src/utils/imageDataUtils";

import { UseControllerProps, State, Action, MethodType } from "./types";

const initialState: State = {
  methodType: "",
  width: "",
  height: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "initialize":
      state = { ...initialState };
      break;

    case "change-method-type":
      state = { ...state, methodType: action.methodType };
      break;

    case "change-width":
      state = { ...state, width: action.payload };
      break;

    case "change-height":
      state = { ...state, height: action.payload };
      break;
  }
  return state;
};

const useController = ({ items, addItem }: UseControllerProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "initialize" });
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
      type: "width" | "height"
    ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
    (event) => {
      event.preventDefault();
      dispatch({ type: `change-${type}`, payload: event.target.value });
    };

  const onClickAdd = useCallback(async () => {
    if (state.methodType === "scale") {
      const item = items[items.length - 1];
      const matrix = imageDataToPixelMatrix(item.imageData);
      const result = bilinearInterpolation(
        matrix,
        parseInt(state.width),
        parseInt(state.height)
      );
      const title = `Scale: (${state.width} x ${state.height})`;
      const imageData = pixelMatrixToImageData(result);
      addItem({ title, imageData });
    }
  }, [state, items, addItem]);

  return {
    state,
    isAddable: state.methodType === "scale" && !!state.width && !!state.height,
    onChangeMethodType,
    onChangeTextField,
    onClickAdd,
  };
};

export default useController;
