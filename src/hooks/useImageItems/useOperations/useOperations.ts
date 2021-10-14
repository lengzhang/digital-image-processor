import { useCallback } from "react";

import useMessages from "src/hooks/useMessages";
import * as operations from "src/utils/operations";

import { ImageItemsDispatch, ImageItemsState } from "../types";

import { Addition, Subtraction, Scaling } from "./types";

const useSpatialFilter = (
  state: ImageItemsState,
  dispatch: ImageItemsDispatch
) => {
  const { pushMessage } = useMessages();

  const addition: Addition = useCallback(
    async ({ source, addend }) => {
      dispatch({ type: "set-status", status: "addition" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        if (addend < 0 || addend >= items.length) {
          throw new Error("addend index is out of range");
        }

        const addendItem = items[addend];

        const matrix = await operations.addition(
          sourceItem.matrix,
          addendItem.matrix
        );

        dispatch({
          type: "push-item",
          item: {
            type: "operation",
            method: "addition",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            addend,
          },
        });
        pushMessage({
          message: "Calculating addition succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating addition failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const subtraction: Subtraction = useCallback(
    async ({ source, minuend }) => {
      dispatch({ type: "set-status", status: "subtraction" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        if (minuend < 0 || minuend >= items.length) {
          throw new Error("minuend index is out of range");
        }

        const minuendItem = items[minuend];

        const matrix = await operations.subtraction(
          sourceItem.matrix,
          minuendItem.matrix
        );

        dispatch({
          type: "push-item",
          item: {
            type: "operation",
            method: "subtraction",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
            minuend,
          },
        });
        pushMessage({
          message: "Calculating subtraction succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating subtraction failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  const scaling: Scaling = useCallback(
    async ({ source }) => {
      dispatch({ type: "set-status", status: "scaling" });
      try {
        const items = state.items;
        if (source < 0 || source >= items.length) {
          throw new Error("source index is out of range");
        }

        const sourceItem = items[source];

        const matrix = await operations.scaling(sourceItem.matrix);

        dispatch({
          type: "push-item",
          item: {
            type: "operation",
            method: "scaling",
            matrix,
            source,
            bit: sourceItem.bit,
            isGrayScaled: sourceItem.isGrayScaled,
          },
        });
        pushMessage({
          message: "Calculating scaling succeeded",
          severity: "success",
        });
      } catch (error: any) {
        dispatch({
          type: "set-error",
          error: error?.message ?? "Calculating scaling failed",
        });
      }
      dispatch({ type: "set-status", status: "idle" });
    },
    [state.items, dispatch, pushMessage]
  );

  return { addition, subtraction, scaling };
};

export default useSpatialFilter;
