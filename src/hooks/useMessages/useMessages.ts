import { createContext, useContext } from "react";
import { MessagesContext } from "./types";

export const messagesContext = createContext({} as MessagesContext);

export const useMessages = () => useContext(messagesContext);

export default useMessages;
