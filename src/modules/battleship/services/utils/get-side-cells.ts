import { CellPosition } from "../../typedefs";

import { fieldSize } from "../../constants";

export const getSideCells = (cells: Array<CellPosition>) => {
  const sideCellsIndexes = new Set<number>();

  cells.forEach(({ x, y }) => {
    for (let i = -1; i <= 1; i++) {
      const sideCellX = x + i;

      if (sideCellX < 0) continue;
      if (sideCellX > fieldSize.height - 1) break;

      for (let j = -1; j <= 1; j++) {
        const sideColumnY = y + j;

        if (sideColumnY < 0) continue;
        if (sideColumnY > fieldSize.width - 1) break;

        sideCellsIndexes.add(CellPosition.position2Index(sideCellX, sideColumnY));
      }
    }
  });

  cells.forEach(({ x, y }) => sideCellsIndexes.delete(CellPosition.position2Index(x, y)));

  return Array.from(sideCellsIndexes.values()).map((cellIndex) => new CellPosition(cellIndex));
};
