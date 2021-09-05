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

export type StatusType = "idle" | "loading";
export type MethodType = "" | "spatial-resolution" | "gray-level-resolution";
export type SpatialAlgorithm =
  | "nearest-neighbor-interpolation"
  | "linear-inerpolation"
  | "bilinear-interpolation";

export interface State {
  status: StatusType;
  source: number;
  methodType: MethodType;
  /** Spatial Resolution */
  spatialAlgorithm: SpatialAlgorithm;
  width: string;
  height: string;
  /** Gray Level Resolution */
  bit: BitType;
}

export type Action =
  | { type: "initialize"; payload?: Partial<State> }
  | { type: "change-source"; payload: number }
  | { type: "set-status"; status: StatusType }
  | { type: "change-method-type"; methodType: MethodType }
  | { type: "change-spatial-algorithm"; payload: SpatialAlgorithm }
  | { type: "change-width" | "change-height"; payload: string }
  | { type: "change-bit"; payload: BitType };

export interface MainControllerProps {
  numOfItems: number;
  disabledAdd: boolean;
  showRemove: boolean;
  source: number;
  onChangeSource: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onClickAdd: React.MouseEventHandler<HTMLButtonElement>;
  onClickClear: React.MouseEventHandler<HTMLButtonElement>;
  onClickRemove: React.MouseEventHandler<HTMLButtonElement>;
}
