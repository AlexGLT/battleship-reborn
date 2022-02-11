import { BattleShipStore } from "../modules/battleship/services/store";


export interface RootStoreInterface {
  battleShipStore: BattleShipStore
}

export class RootStore implements RootStoreInterface {
  public battleShipStore: BattleShipStore;

  constructor() {
    this.battleShipStore = new BattleShipStore();
  }
}
