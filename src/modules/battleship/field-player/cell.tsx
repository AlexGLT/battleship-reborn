import { MouseEvent, PointerEvent } from "react";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { cellStatuses } from "../constants";

import clsx from "clsx";

import "./cell.scss";

interface CellProps {
  classNames?: string;
  row: number;
  column: number;
  startDragging: boolean;
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
  const { playerGameField, unDropShip, draggingState: { shipId, hover, unHover } } = useBattleShipStore();

  const { isBusy, status } = computed(() => playerGameField[row][column]).get();

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (isBusy) unDropShip(row, column);
  };

  const handleDragEnter = (event: PointerEvent) => {
    event.stopPropagation();

    if (shipId) {
      hover(row, column);
    }
  };

  const handleDragLeave = (event: PointerEvent) => {
    event.stopPropagation();

    if (shipId) {
      unHover(row, column);
    }
  };

  return (
    <td
      style={{ pointerEvents: "all" }}
      className={clsx("cell", classNames, getStylesByStatus(status))}
      onContextMenu={handleContextMenu}
      onPointerEnter={handleDragEnter}
      onPointerLeave={handleDragLeave}
    />
  );
});
