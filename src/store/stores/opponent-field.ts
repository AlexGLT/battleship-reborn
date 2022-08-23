import { makeAutoObservable } from "mobx";


import { RootStore } from "../root-store";
import { generateBattleField } from "./utils";
import { OpponentCell } from "./entities";
import { ShootResult } from "/constants";

export class OpponentField {
    private rootStore: RootStore;

    public playerField: OpponentCell[][] = generateBattleField(true) as OpponentCell[][];

    constructor(store: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });

        this.rootStore = store;
    }

    public getCellState = (cellX: number, cellY: number) => this.playerField[cellX][cellY];

    public shot = (cellX: number, cellY: number, result: ShootResult) => {
        this.playerField[cellX][cellY].shot(result);
    };
}
