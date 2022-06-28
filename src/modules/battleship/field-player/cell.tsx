import { MouseEvent } from "react";
import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { CellPosition, CellState } from "../typedefs";

import clsx from "clsx";

import "./cell.scss";
import { computed } from "mobx";

interface CellProps {
    classNames?: string;
    row: number;
    column: number;
}

const getStylesByCellState = ({ isHovered, isBusy, isAdjoined }: CellState, canDrop: boolean | null) => {
    if (isHovered && (isBusy || isAdjoined)) return "cell_hovered cell_hovered-collision";
    else if (isHovered && !canDrop) return "cell_hovered cell_hovered-cant-drop";
    else if (isBusy) return "cell_busy";
    else if (isAdjoined) return "cell_side";
    else if (isHovered && canDrop) return "cell_hovered cell_hovered-can-drop";

    return "";
};

export const Cell = observer(({ classNames, row, column }: CellProps) => {
    const {
        playerFieldState: { getCellState },
        raiseShip,
        draggingState
    } = useBattleShipStore();

    const cellState = getCellState(row, column).status;

    const cellStatus = computed(() => getStylesByCellState(cellState, draggingState.canDrop)).get();

    const handleContextMenu = (event: MouseEvent<HTMLTableCellElement>) => {
        event.preventDefault();

        if (cellState.isBusy) raiseShip(row, column);
    };

    const handlePointerEnter = () => draggingState.setHoverCell(new CellPosition(row, column));

    return (
        <td
            className={clsx("cell", classNames, cellStatus)}
            onContextMenu={handleContextMenu}
            onPointerEnter={draggingState.shipId ? handlePointerEnter : undefined}
        />
    );
});
