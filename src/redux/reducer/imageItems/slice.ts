import { createSlice } from "@reduxjs/toolkit";

import * as actions from "./actions";
import { ImageItemsAction, ImageItemsState } from "./types";

const initialState: ImageItemsState = {
  status: "idle",
  items: [],
  error: null,
};

const imageItemsSlice = createSlice<ImageItemsState, ImageItemsAction>({
  name: "imageItems",
  initialState,
  reducers: {
    initialize: () => initialState,
    popItem: (state) => {
      return { ...state, items: state.items.slice(0, state.items.length - 1) };
    },
  },
  extraReducers: (builder) => {
    /** Set Original Item */
    builder
      .addCase(actions.setOriginalFile.pending, (state) => {
        return { ...state, status: "seting-original-file" };
      })
      .addCase(actions.setOriginalFile.fulfilled, (state, action) => {
        return { ...initialState, status: "idle", items: [action.payload] };
      })
      .addCase(actions.setOriginalFile.rejected, (state, action) => {
        return { ...state, error: action.error };
      });

    /** Spatial Resolution */
    /** nearestNeighborInterpolation */
    builder
      .addCase(actions.nearestNeighborInterpolation.pending, (state) => {
        return { ...state, status: "nearest-neighbor-interpolation" };
      })
      .addCase(
        actions.nearestNeighborInterpolation.fulfilled,
        (state, action) => {
          return {
            ...state,
            status: "idle",
            items: [...state.items, action.payload],
          };
        }
      )
      .addCase(
        actions.nearestNeighborInterpolation.rejected,
        (state, action) => {
          return { ...state, error: action.error };
        }
      );

    /** linearInterpolation */
    builder
      .addCase(actions.linearInterpolation.pending, (state) => {
        return { ...state, status: "linear-interpolation" };
      })
      .addCase(actions.linearInterpolation.fulfilled, (state, action) => {
        return {
          ...state,
          status: "idle",
          items: [...state.items, action.payload],
        };
      })
      .addCase(actions.linearInterpolation.rejected, (state, action) => {
        return { ...state, error: action.error };
      });

    /** bilinearInterpolation */
    builder
      .addCase(actions.bilinearInterpolation.pending, (state) => {
        return { ...state, status: "bilinear-interpolation" };
      })
      .addCase(actions.bilinearInterpolation.fulfilled, (state, action) => {
        return {
          ...state,
          status: "idle",
          items: [...state.items, action.payload],
        };
      })
      .addCase(actions.bilinearInterpolation.rejected, (state, action) => {
        return { ...state, error: action.error };
      });

    /** Gray Level Resolution */
    builder
      .addCase(actions.grayLevelResolution.pending, (state) => {
        return { ...state, status: "gray-level-resolution" };
      })
      .addCase(actions.grayLevelResolution.fulfilled, (state, action) => {
        return {
          ...state,
          status: "idle",
          items: [...state.items, action.payload],
        };
      })
      .addCase(actions.grayLevelResolution.rejected, (state, action) => {
        return { ...state, error: action.error };
      });
  },
});

export default imageItemsSlice;
