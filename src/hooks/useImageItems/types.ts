import { BitType } from "src/utils/grayLevelResolution";
import { Pixel } from "src/utils/imageDataUtils";

interface DefaultItemProperties {
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
export type SpatialFilteringMethodType =
  | "gaussian-smoothing-filter"
  | "median-filter"
  | "sharpening-laplacian-filter"
  | "high-boosting-filter";
export type SharpeningLaplacianMaskMode =
  | "mask-4"
  | "mask-8"
  | "mask-4-reverse"
  | "mask-8-reverse";
export type SpatialFilteringItem = DefaultItemProperties & {
  type: "spatial-filtering";
} & (
    | {
        method: "gaussian-smoothing-filter";
        filterSize: number; // (filterSize x filterSize)
        K: number;
        sigma: number; // For smoothing filter
      }
    | {
        method: "median-filter";
        filterSize: number; // (filterSize x filterSize)
      }
    | {
        method: "sharpening-laplacian-filter";
        maskMode: SharpeningLaplacianMaskMode;
        processMode: "none" | "scaled" | "sharpened";
      }
    | {
        method: "high-boosting-filter";
        blurredImage: number; // index of the blurred image
        highBoostingK: number; // Property for high-boosting filter
      }
  );

type ImageItemsStatus =
  | "idle"
  | "seting-original-file"
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

/** Spatial Resolution */
export interface SpatialResolutionParams {
  source: number;
  width: number;
  height: number;
}

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

/** Spatial Filtering */
export interface SpatialFilteringParams {
  source: number;
  method: SpatialFilteringMethodType;
  size: number; // Kernel size
  /** Smoothing Filter */
  K?: number;
  sigma?: number;
  /** Sharpening Laplacian Filter */
  maskMode?: SharpeningLaplacianMaskMode;
  processMode?: string;
  /** High-boosting Filter */
  blurredImage?: number;
  highBoostingK?: number; // Property for high-boosting filter
}

export interface ImageItemsContext {
  state: ImageItemsState;
  initialize: () => void;
  popItem: () => void;
  addOriginalImage: (file: File) => Promise<void>;
  nearestNeighborInterpolation: (
    params: SpatialResolutionParams
  ) => Promise<void>;
  linearInterpolation: (
    coor: "x" | "y"
  ) => (params: SpatialResolutionParams) => Promise<void>;
  bilinearInterpolation: (params: SpatialResolutionParams) => Promise<void>;
  grayLevelResolution: (params: GrayLevelResolutionParams) => Promise<void>;
  bitPlanesRemoving: (params: BitPlanesRemovingParams) => Promise<void>;
  histogramEqualization: (params: HistogramEqualizationParams) => Promise<void>;
  spatialFiltering: (params: SpatialFilteringParams) => Promise<void>;
}
