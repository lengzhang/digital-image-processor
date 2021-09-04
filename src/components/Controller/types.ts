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

export type MethodType = "" | "scale" | "gray level resolution";

export interface State {
  methodType: MethodType;
  width: string;
  height: string;
  bit: BitType;
}

export type Action =
  | { type: "initialize" }
  | { type: "change-method-type"; methodType: MethodType }
  | { type: "change-width" | "change-height"; payload: string }
  | { type: "change-bit"; payload: BitType };
