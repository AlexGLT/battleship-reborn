import { useContext } from "react";

import { StoreContext } from "./context";

export const useRootStore = () => useContext(StoreContext);
