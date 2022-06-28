import { Cell } from "../state-elements";

import { fieldSize } from "../../constants";

export const generateBattleField = () => {
    const field: Cell[][] = [];

    for (let i = 0; i < fieldSize.height; i++) {
        const row: Cell[] = [];

        for (let j = 0; j < fieldSize.width; j++) {
            row.push(new Cell());
        }

        field.push(row);
    }

    return field;
};
