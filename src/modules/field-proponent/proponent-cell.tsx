import { useCallback } from "react";
import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";

import { CellPosition } from "/models";

import { Cell } from "/components";

import type { MouseEvent } from "react";

type CellProps = {
    row: number,
    column: number,
}

export const ProponentCell = observer(({ row, column }: CellProps) => {
    const {
        proponentField: { getCellState },
        dndController: { setHoverCell, raiseShip },
    } = useRootStore();

    const { status, isBusy } = getCellState(row, column);

    console.log(row, column, status);

    const handleRightClick = useCallback((event: MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();

        if (isBusy) raiseShip(row, column);
    }, [row, column, raiseShip]);

    const handlePointerEnter = useCallback(() => {
        setHoverCell(new CellPosition(row, column));
    }, [row, column, setHoverCell]);

    return (
        <Cell
            status={status}
            mix="field-proponent__cell"
            handlePointerEnter={handlePointerEnter}
            handleRightClick={handleRightClick}
        />
    );
});
