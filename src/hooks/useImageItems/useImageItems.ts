import { createContext, useContext } from "react";
import { ImageItemsContext } from "./types";

export const imageItemsContext = createContext({} as ImageItemsContext);

export const useImageItems = () => useContext(imageItemsContext);

export default useImageItems;
