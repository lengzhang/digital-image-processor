import { Item } from "src/components/App";

import { BitType } from "src/utils/grayLevelResolution";

export interface ControllerProps {
  isLoading: boolean;
  items: Item[];
  addItem: (item: Item) => void;
  onClearAllItems: () => void;
  onImageUploadButtonChange: React.ChangeEventHandler<HTMLInputElement>;
  onRemoveLastItem: () => void;
}

export interface UseControllerProps {
  items: Item[];
  addItem: (item: Item) => void;
}

export type MethodType = "" | "spatial-resolution" | "gray-level-resolution";
export type SpatialAlgorithm =
  | "nearest-neighbor-interpolation"
  | "linear-inerpolation"
  | "bilinear-interpolation";

export interface State {
  methodType: MethodType;
  /** Spatial Resolution */
  spatialAlgorithm: SpatialAlgorithm;
  width: string;
  height: string;
  /** Gray Level Resolution */
  bit: BitType;
}

export type Action =
  | { type: "initialize" }
  | { type: "change-method-type"; methodType: MethodType }
  | { type: "change-spatial-algorithm"; payload: SpatialAlgorithm }
  | { type: "change-width" | "change-height"; payload: string }
  | { type: "change-bit"; payload: BitType };
