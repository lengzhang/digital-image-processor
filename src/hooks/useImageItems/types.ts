import React from "react";
import { BitType } from "src/utils/grayLevelResolution";
import { Pixel } from "src/utils/imageDataUtils";

import useSpatialResolution from "./useSpatialResolution";
import useSpatialFilter, { SpatialFilteringItem } from "./useSpatialFilter";

export interface DefaultItemProperties {
  matrix: Pixel[][];
  source: number | null;
  bit: BitType;
  isGrayScaled: boolean;
}

/** Original */
export interface OriginalItem extends DefaultItemProperties {
  type: "original";
}

/** Spatial Resolution */
export type SpatialResolutionMethodType =
  | "nearest-neighbor-interpolation"
  | "linear-interpolation-x"
  | "linear-interpolation-y"
  | "bilinear-interpolation";

export interface SpatialResolutionItem extends DefaultItemProperties {
  type: "spatial-resolution";
  method: SpatialResolutionMethodType;
  width: number;
  height: number;
}

/** Gray Level Resolution */
export interface GrayLevelResolutionItem extends DefaultItemProperties {
  type: "gray-level-resolution";
  bit: BitType;
}

/** Bit Planes Removing */
export interface BitPlanesRemovingItem extends DefaultItemProperties {
  type: "bit-planes-removing";
  bits: number;
}

/** Histogram Equalization */
export interface HistogramEqualizationItem extends DefaultItemProperties {
  type: "histogram-equalization";
  heMode: string;
}

/** Spatial Filtering */

type ImageItemsStatus =
  | "idle"
  | "setting-original-file"
  | "nearest-neighbor-interpolation"
  | "linear-interpolation-x"
  | "linear-interpolation-y"
  | "bilinear-interpolation"
  | "gray-level-resolution"
  | "bit-planes-removing"
  | "histogram-equalization"
  | "spatial-filtering";

export type ImageItem =
  | OriginalItem
  | SpatialResolutionItem
  | GrayLevelResolutionItem
  | BitPlanesRemovingItem
  | HistogramEqualizationItem
  | SpatialFilteringItem;

export interface ImageItemsState {
  status: ImageItemsStatus;
  items: ImageItem[];
  error: string;
}

export type ImageItemsAction =
  | { type: "initialize" | "pop-item" }
  | { type: "set-status"; status: ImageItemsStatus }
  | { type: "set-error"; error: string }
  | { type: "push-item"; item: ImageItem };

export type ImageItemsDispatch = React.Dispatch<ImageItemsAction>;

/** Gray Level Resolution */
export interface GrayLevelResolutionParams {
  source: number;
  bit?: BitType;
}

/** Bit Planes Removing */
export interface BitPlanesRemovingParams {
  source: number;
  bits: number;
}

/** Histogram Equalization */
export interface HistogramEqualizationParams {
  source: number;
  size?: number; // Mask size for local
}

export interface ImageItemsContext
  extends ReturnType<typeof useSpatialResolution>,
    ReturnType<typeof useSpatialFilter> {
  state: ImageItemsState;
  initialize: () => void;
  popItem: () => void;
  addOriginalImage: (file: File) => Promise<void>;

  grayLevelResolution: (params: GrayLevelResolutionParams) => Promise<void>;
  bitPlanesRemoving: (params: BitPlanesRemovingParams) => Promise<void>;
  histogramEqualization: (params: HistogramEqualizationParams) => Promise<void>;
}
