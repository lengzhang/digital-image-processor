import { CardHeaderProps } from "@material-ui/core/CardHeader";

export interface Item extends Pick<CardHeaderProps, "title" | "subheader"> {
  imageData: ImageData;
}

export interface State {
  status: "idle" | "loading";
  items: Item[];
}

export type Action =
  | { type: "initialize" }
  | { type: "set-status"; status: "idle" | "loading" }
  | { type: "push-item"; item: Item }
  | { type: "pop-item" };
