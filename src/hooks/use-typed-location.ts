import { useLocation } from "react-router-dom";

export const useLocationState = <T>() => {
    return (useLocation().state ?? {}) as T;
};
