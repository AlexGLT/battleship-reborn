import { Cell } from "../state-elements";

export const generateBattleField = () => {
  const field: Cell[][] = [];

  for (let i = 0; i < 10; i++) {
    const row: Cell[] = [];

    for (let j = 0; j < 10; j++) {
      row.push(new Cell());
    }

    field.push(row);
  }

  return field;
};
