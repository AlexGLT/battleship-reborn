import { MouseEvent } from "react";
import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { cellStatuses } from "../constants";

import { CellPosition } from "../typedefs";

import clsx from "clsx";

import "./cell.scss";

interface CellProps {
  classNames?: string;
  row: number;
  column: number;
}

const getStylesByStatus = (status: cellStatuses | undefined) => {
  switch (status) {
    case cellStatuses.collision:
      return "cell_hovered cell_hovered-collision";
    case cellStatuses.hoveredBusy:
      return "cell_hovered cell_hovered-cant-drop";
    case cellStatuses.busy:
      return "cell_busy";
    case cellStatuses.side:
      return "cell_side";
    case cellStatuses.hoveredFree:
      return "cell_hovered cell_hovered-can-drop";
  }

  return "";
};

export const Cell = observer(({ classNames, row, column }: CellProps) => {
  const {
    playerFieldState: { getCellState },
    raiseShip,
    draggingState: { shipId, setHoverCell }
  } = useBattleShipStore();

  const { isBusy, status } = getCellState(row, column);

  const handleContextMenu = (event: MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();

    if (isBusy) raiseShip(row, column);
  };

  const handlePointerEnter = () => setHoverCell(new CellPosition(row, column));

  return (
    <td
      className={clsx("cell", classNames, getStylesByStatus(status))}
      onContextMenu={handleContextMenu}
      onPointerEnter={shipId ? handlePointerEnter : undefined}
    />
  );
});
