import { DefaultItemProperties } from "../types";

export type SpatialFilteringMethodType =
  | "alpha-trimmed-mean-filter"
  | "arithmetic-mean-filter"
  | "contraharmonic-mean-filter"
  | "gaussian-smoothing-filter"
  | "geometric-mean-filter"
  | "harmonic-mean-filter"
  | "high-boosting-filter"
  | "max-filter"
  | "median-filter"
  | "midpoint-filter"
  | "min-filter"
  | "sharpening-laplacian-filter";
export const spatialFilteringMethodType: SpatialFilteringMethodType[] = [
  "alpha-trimmed-mean-filter",
  "arithmetic-mean-filter",
  "contraharmonic-mean-filter",
  "gaussian-smoothing-filter",
  "geometric-mean-filter",
  "harmonic-mean-filter",
  "high-boosting-filter",
  "max-filter",
  "median-filter",
  "midpoint-filter",
  "min-filter",
  "sharpening-laplacian-filter",
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
        method:
          | "arithmetic-mean-filter"
          | "geometric-mean-filter"
          | "harmonic-mean-filter"
          | "max-filter"
          | "median-filter"
          | "midpoint-filter"
          | "min-filter";
        filterSize: number; // (filterSize x filterSize)
      }
    | {
        method: "contraharmonic-mean-filter";
        filterSize: number; // (filterSize x filterSize)
        order: number;
      }
    | {
        method: "gaussian-smoothing-filter";
        filterSize: number; // (filterSize x filterSize)
        K: number;
        sigma: number; // For smoothing filter
      }
    | {
        method: "high-boosting-filter";
        blurredImage: number; // index of the blurred image
        highBoostingK: number; // Property for high-boosting filter
      }
    | {
        method: "sharpening-laplacian-filter";
        maskMode: SharpeningLaplacianMaskMode;
        processMode: "none" | "scaled" | "sharpened";
      }
  );

export interface SizeOnlyFilterParams {
  source: number;
  size: number; // Kernel size
}

export interface ContraharmonicMeanFilterParams {
  source: number;
  size: number; // Kernel size
  order: number;
}

export interface GaussianSmotthingFilterParams {
  source: number;
  size: number; // Kernel size
  K?: number;
  sigma?: number;
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
