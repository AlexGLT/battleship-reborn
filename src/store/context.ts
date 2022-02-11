import { createContext } from "react";
import { RootStoreInterface } from "./store";

export const StoreContext = createContext<RootStoreInterface>({} as RootStoreInterface);
