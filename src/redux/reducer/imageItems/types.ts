import { CaseReducer, SerializedError } from "@reduxjs/toolkit";

import { BitType } from "src/utils/grayLevelResolution";
import { Pixel } from "src/utils/imageDataUtils";

export type MethodType =
  | "nearest-neighbor-interpolation"
  | "linear-interpolation-x"
  | "linear-interpolation-y"
  | "bilinear-interpolation";

interface DefaultItemProperties {
  matrix: Pixel[][];
  source: number | null;
}

export interface OriginalItem extends DefaultItemProperties {
  type: "original";
}

export interface SpatialResolutionItem extends DefaultItemProperties {
  type: "spatial-resolution";
  method: MethodType;
  width: number;
  height: number;
}

export interface GrayLevelResolutionItem extends DefaultItemProperties {
  type: "gray-level-resolution";
  bit: BitType;
}

export type ImageItem =
  | OriginalItem
  | SpatialResolutionItem
  | GrayLevelResolutionItem;

export interface ImageItemsState {
  status:
    | "idle"
    | "seting-original-file"
    | "nearest-neighbor-interpolation"
    | "linear-interpolation-x"
    | "linear-interpolation-y"
    | "bilinear-interpolation"
    | "gray-level-resolution";
  items: ImageItem[];
  error: SerializedError | null;
}

export type ImageItemsAction = {
  initialize: CaseReducer<ImageItemsState>;
  popItem: CaseReducer<ImageItemsState>;
};
