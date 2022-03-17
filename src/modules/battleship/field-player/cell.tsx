import { MouseEvent } from "react";
import { useDrop } from "react-dnd";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import clsx from "clsx";

import "./cell.scss";

interface CellProps {
  classNames?: string;
  row: number;
  column: number;
}

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
    <div
      ref={dropRef}
      className={clsx("cell", classNames, { [`cell_${status}`]: status })}
      onContextMenu={isBusy ? handleContextMenu : () => {
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    />
  );
});
