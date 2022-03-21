import { MouseEvent } from "react";
import { useDrop } from "react-dnd";
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
}

const getStylesByStatus = (status: cellStatuses | undefined) => {
  switch (status) {
    case cellStatuses.collision: return "cell_hovered cell_hovered-collision";
    case cellStatuses.hoveredBusy: return "cell_hovered cell_hovered-cant-drop";
    case cellStatuses.busy: return "cell_busy";
    case cellStatuses.side: return "cell_side";
    case cellStatuses.hoveredFree: return "cell_hovered cell_hovered-can-drop";
  }

  return "";
};

export const Cell = observer(({ classNames, row, column }: CellProps) => {
  const { playerGameField, dropShip, unDropShip, draggingState: { hover, unHover } } = useBattleShipStore();

  const { isBusy, status, canDrop } = computed(() => playerGameField[row][column]).get();

  const [, dropRef] = useDrop({
    accept: "ship",
    canDrop: () => !!canDrop,
    drop: () => {
      dropShip(row, column);
    }
  }, [status, canDrop]);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    unDropShip(row, column);
  };

  const handleDragEnter = () => hover([row, column]);
  const handleDragLeave = () => unHover([row, column]);

  return (
    <td
      ref={dropRef}
      className={clsx("cell", classNames, getStylesByStatus(status))}
      onContextMenu={isBusy ? handleContextMenu : undefined}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    />
  );
});
