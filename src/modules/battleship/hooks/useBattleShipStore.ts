import { useRootStore } from "../../../store/hooks";

export const useBattleShipStore = () => {
  const { battleShipStore } = useRootStore();

  return battleShipStore;
};
