import { MouseEvent, PointerEvent } from "react";
import clsx from "clsx";

import { cellStyle } from "/constants";

import "./cell.scss";

import type { CellStatus } from "/constants";

type CellProps = {
    status: CellStatus,
    mix?: string,
    handleLeftClick?: (event: PointerEvent<HTMLTableCellElement>) => void,
    handleRightClick?: (event: MouseEvent<HTMLTableCellElement>) => void,
    handlePointerEnter?: (event: PointerEvent<HTMLTableCellElement>) => void,
};

export const Cell = ({ status, mix, handleLeftClick, handleRightClick, handlePointerEnter }: CellProps) => {
    return (
        <td
            className={clsx("cell", { [`cell_${cellStyle[status]}`]: status }, mix)}
            onPointerDown={handleLeftClick}
            onPointerEnter={handlePointerEnter}
            onContextMenu={handleRightClick}
        />
    );
};
