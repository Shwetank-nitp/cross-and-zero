import { createContext, useContext } from "react";

export const stateContext = createContext();

export function useStateContext() {
  return useContext(stateContext);
}
