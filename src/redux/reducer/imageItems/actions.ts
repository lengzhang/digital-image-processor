import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  imageFileToImageData,
  imageDataToPixelMatrix,
} from "src/utils/imageDataUtils";
import * as spatialResolution from "src/utils/spatialResolution";
import {
  grayLevelResolution as glResolution,
  BitType,
} from "src/utils/grayLevelResolution";
import { RootState } from "src/redux/store";
import {
  GrayLevelResolutionItem,
  OriginalItem,
  SpatialResolutionItem,
} from ".";

export const setOriginalFile = createAsyncThunk<OriginalItem, File>(
  "imageItems/setOriginalFile",
  async (file: File) => {
    const imageData = await imageFileToImageData(file);
    const matrix = imageDataToPixelMatrix(imageData);
    return { type: "original", source: null, matrix };
  }
);

/** Spatial Resolution */

interface SpatialResolutionParams {
  source: number;
  width: number;
  height: number;
}

export const nearestNeighborInterpolation = createAsyncThunk<
  SpatialResolutionItem,
  SpatialResolutionParams,
  { state: RootState }
>(
  "imageItems/nearestNeighborInterpolation",
  async ({ source, width, height }, thunk) => {
    const items = thunk.getState().imageItems.items;

    if (source < 0 || source >= items.length)
      throw new Error("source index is out of range");

    const matrix = await spatialResolution.nearestNeighborInterpolation(
      items[source].matrix,
      width,
      height
    );

    return {
      type: "spatial-resolution",
      method: "nearest-neighbor-interpolation",
      source,
      width,
      height,
      matrix,
    };
  }
);

export const linearInterpolation = createAsyncThunk<
  SpatialResolutionItem,
  SpatialResolutionParams,
  { state: RootState }
>(
  "imageItems/linearInterpolation",
  async ({ source, width, height }, thunk) => {
    const items = thunk.getState().imageItems.items;

    if (source < 0 || source >= items.length)
      throw new Error("source index is out of range");

    const matrix = await spatialResolution.linearInterpolation(
      items[source].matrix,
      width,
      height
    );

    return {
      type: "spatial-resolution",
      method: "linear-interpolation",
      source,
      width,
      height,
      matrix,
    };
  }
);

export const bilinearInterpolation = createAsyncThunk<
  SpatialResolutionItem,
  SpatialResolutionParams,
  { state: RootState }
>(
  "imageItems/bilinearInterpolation",
  async ({ source, width, height }, thunk) => {
    const items = thunk.getState().imageItems.items;

    if (source < 0 || source >= items.length)
      throw new Error("source index is out of range");

    const matrix = await spatialResolution.bilinearInterpolation(
      items[source].matrix,
      width,
      height
    );

    return {
      type: "spatial-resolution",
      method: "bilinear-interpolation",
      source,
      width,
      height,
      matrix,
    };
  }
);

/** Gray Level Resolution */
interface GrayLevelResolutionParams {
  source: number;
  bit?: BitType;
}

export const grayLevelResolution = createAsyncThunk<
  GrayLevelResolutionItem,
  GrayLevelResolutionParams,
  { state: RootState }
>("imageItems/grayLevelResolution", async ({ source, bit = 8 }, thunk) => {
  const items = thunk.getState().imageItems.items;

  if (source < 0 || source >= items.length)
    throw new Error("source index is out of range");

  const matrix = await glResolution(items[source].matrix, bit);

  return { type: "gray-level-resolution", source, bit, matrix };
});
