import { fieldSize } from "/constants/";
import { OpponentCell, ProponentCell } from "../entities";

type GameFieldCell = OpponentCell | ProponentCell;

export const generateBattleField = (opponent: boolean = false) => {
    const field: GameFieldCell[][] = [];

    for (let i = 0; i < fieldSize.height; i++) {
        const row: GameFieldCell[] = [];

        for (let j = 0; j < fieldSize.width; j++) {
            row.push(opponent ? new OpponentCell() : new ProponentCell());
        }

        field.push(row);
    }

    return field;
};
