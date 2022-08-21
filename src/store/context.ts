import { createContext } from "react";

import { RootStore } from "./root-store";

export const StoreContext = createContext<RootStore>({} as RootStore);
