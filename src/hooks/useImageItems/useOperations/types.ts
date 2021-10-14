import { DefaultItemProperties } from "..";

export type OperationItem = DefaultItemProperties & {
  type: "operation";
} & (
    | { method: "addition"; addend: number }
    | { method: "subtraction"; minuend: number }
    | { method: "scaling" }
  );

export interface Addition {
  (params: { source: number; addend: number }): void;
}

export interface Subtraction {
  (params: { source: number; minuend: number }): void;
}

export interface Scaling {
  (params: { source: number }): void;
}
