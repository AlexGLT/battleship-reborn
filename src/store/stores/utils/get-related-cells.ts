import { CellPosition } from "/models";

import { Direction, fieldSize } from "/constants";

import range from "lodash-es/range";

export const getRelatedCells = (
    x: number,
    y: number,
    length: number,
    direction: Direction,
    deckIndex: number = 0,
): Array<CellPosition> => {
    const isHorizontal = direction === Direction.horizontal;

    const firstDeckPlace = (isHorizontal ? y : x) - deckIndex;
    const maxDeckPlace = isHorizontal ? fieldSize.width : fieldSize.height;

    return range(Math.max(firstDeckPlace, 0), Math.min(firstDeckPlace + length, maxDeckPlace))
        .map((axis) => isHorizontal ? new CellPosition(x, axis) : new CellPosition(axis, y));
};
