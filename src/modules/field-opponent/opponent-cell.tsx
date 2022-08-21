import { useCallback } from "react";
import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";

import { Cell } from "/components";

interface CellProps {
    row: number;
    column: number;
}

export const OpponentCell = observer(({ row, column }: CellProps) => {
    const {
        opponentField: { getCellState },
        onlineController: { shoot },
    } = useRootStore();

    const handlePointerDown = useCallback(() => {
        shoot(row, column);
    }, [row, column, shoot]);

    const { status } = getCellState(row, column);

    return (
        <Cell
            status={status}
            mix="field-proponent__cell"
            handleLeftClick={handlePointerDown}
        />
    );
});
