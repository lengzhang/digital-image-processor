import { DefaultItemProperties } from "../types";

export type SpatialFilteringMethodType =
  | "gaussian-smoothing-filter"
  | "median-filter"
  | "sharpening-laplacian-filter"
  | "high-boosting-filter"
  | "arithmetic-mean-filter"
  | "geometric-mean-filter"
  | "harmonic-mean-filter"
  | "contraharmonic-mean-filter"
  | "max-filter"
  | "min-filter"
  | "midpoint-filter"
  | "alpha-trimmed-mean-filter";
export const spatialFilteringMethodType: SpatialFilteringMethodType[] = [
  "gaussian-smoothing-filter",
  "median-filter",
  "sharpening-laplacian-filter",
  "high-boosting-filter",
  "arithmetic-mean-filter",
  "geometric-mean-filter",
  "harmonic-mean-filter",
  "contraharmonic-mean-filter",
  "max-filter",
  "min-filter",
  "midpoint-filter",
  "alpha-trimmed-mean-filter",
];

export type SharpeningLaplacianMaskMode =
  | "mask-4"
  | "mask-8"
  | "mask-4-reverse"
  | "mask-8-reverse";
export const sharpeningLaplacianMaskMode: SharpeningLaplacianMaskMode[] = [
  "mask-4",
  "mask-8",
  "mask-4-reverse",
  "mask-8-reverse",
];

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
        method:
          | "median-filter"
          | "min-filter"
          | "max-filter"
          | "midpoint-filter";
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
export interface GaussianSmotthingFilterParams {
  source: number;
  size: number; // Kernel size
  K?: number;
  sigma?: number;
}

export interface MedianFilterParams {
  source: number;
  size: number; // Kernel size
}

export interface SharpeningLaplacianFilterParams {
  source: number;
  maskMode?: SharpeningLaplacianMaskMode;
  processMode?: string;
}

export interface HighBoostingFilterParams {
  source: number;
  blurredImage?: number;
  highBoostingK?: number; // Property for high-boosting filter
}
