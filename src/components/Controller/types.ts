import { Item } from "src/components/App";

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

export type MethodType = "" | "scale";

export interface State {
  methodType: MethodType;
  width: string;
  height: string;
}

export type Action =
  | { type: "initialize" }
  | { type: "change-method-type"; methodType: MethodType }
  | { type: "change-width"; payload: string }
  | { type: "change-height"; payload: string };
