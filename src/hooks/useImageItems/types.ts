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
export type MethodType =
  | "nearest-neighbor-interpolation"
  | "linear-interpolation-x"
  | "linear-interpolation-y"
  | "bilinear-interpolation";

export interface SpatialResolutionItem extends DefaultItemProperties {
  type: "spatial-resolution";
  method: MethodType;
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
}

type ImageItemsStatus =
  | "idle"
  | "seting-original-file"
  | "nearest-neighbor-interpolation"
  | "linear-interpolation-x"
  | "linear-interpolation-y"
  | "bilinear-interpolation"
  | "gray-level-resolution"
  | "bit-planes-removing"
  | "histogram-equalization";

export type ImageItem =
  | OriginalItem
  | SpatialResolutionItem
  | GrayLevelResolutionItem
  | BitPlanesRemovingItem
  | HistogramEqualizationItem;

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
  size?: number; // Mash size for local
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
}
