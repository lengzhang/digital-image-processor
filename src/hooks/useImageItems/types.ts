import React from "react";
import { BitType } from "src/utils/grayLevelResolution";
import { Pixel } from "src/utils/imageDataUtils";

import useSpatialResolution, {
  SpatialResolutionItem,
} from "./useSpatialResolution";
import useSpatialFilter, { SpatialFilteringItem } from "./useSpatialFilter";
import useNoiseDistribution, {
  NoiseDistributionItem,
} from "./useNoiseDistribution";
import useOperations, { OperationItem } from "./useOperations";

export interface DefaultItemProperties {
  matrix: Pixel[][];
  source: number | null;
  bit: BitType;
  isGrayScaled: boolean;
}

/** Original */
export interface OriginalItem extends DefaultItemProperties {
  type: "original";
  filename: string;
}

/** Spatial Resolution */

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

type ImageItemsStatus =
  | "idle"
  | "setting-original-file"
  | SpatialResolutionItem["method"]
  // | "nearest-neighbor-interpolation"
  // | "linear-interpolation-x"
  // | "linear-interpolation-y"
  // | "bilinear-interpolation"
  | "gray-level-resolution"
  | "bit-planes-removing"
  | "histogram-equalization"
  | SpatialFilteringItem["type"]
  // | "spatial-filtering"
  | NoiseDistributionItem["method"]
  | OperationItem["method"];

export type ImageItem =
  | OriginalItem
  | SpatialResolutionItem
  | GrayLevelResolutionItem
  | BitPlanesRemovingItem
  | HistogramEqualizationItem
  | SpatialFilteringItem
  | NoiseDistributionItem
  | OperationItem;

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
    ReturnType<typeof useSpatialFilter>,
    ReturnType<typeof useNoiseDistribution>,
    ReturnType<typeof useOperations> {
  state: ImageItemsState;
  initialize: () => void;
  popItem: () => void;
  addOriginalImage: (file: File) => Promise<void>;

  grayLevelResolution: (params: GrayLevelResolutionParams) => Promise<void>;
  bitPlanesRemoving: (params: BitPlanesRemovingParams) => Promise<void>;
  histogramEqualization: (params: HistogramEqualizationParams) => Promise<void>;
}
