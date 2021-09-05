import React, { useCallback, useReducer } from "react";

import { imageFileToImageData } from "src/utils/imageDataUtils";

import { State, Action, Item } from "./types";

const initialState: State = {
  status: "idle",
  items: [],
};
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "initialize":
      state = { ...initialState };
      break;

    case "set-status":
      state = { ...state, status: action.status };
      break;

    case "push-item":
      state = { ...state, items: [...state.items, action.item] };
      break;

    case "pop-item":
      state = {
        ...state,
        items: [...state.items.slice(0, state.items.length - 1)],
      };
      break;
  }
  return state;
};

const useApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onSelectImage: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const file = event.currentTarget?.files?.item(0) ?? null;
      if (file !== null && state.status === "idle") {
        dispatch({ type: "set-status", status: "loading" });
        imageFileToImageData(file)
          .then((imageData) => {
            dispatch({
              type: "push-item",
              item: {
                title: `Original: ${file.name} (${imageData.width} x ${imageData.height})`,
                imageData,
              },
            });
          })
          .finally(() => {});

        dispatch({ type: "set-status", status: "idle" });
      }
    },
    [state.status]
  );

  const onClearAllItems = () => {
    dispatch({ type: "initialize" });
  };

  const onRemoveLastItem = () => {
    dispatch({ type: "pop-item" });
  };

  const addItem = (item: Item) => {
    dispatch({ type: "push-item", item });
  };

  return {
    ...state,
    onSelectImage,
    onClearAllItems,
    onRemoveLastItem,
    addItem,
  };
};

export default useApp;
