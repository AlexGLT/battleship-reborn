import { MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";

import { useBattleShipStore } from "../hooks";

import "./cell.scss";

interface CellProps {
  classNames?: string;
  row: number,
  column: number
}

export const Cell = observer(({ classNames, row, column }: CellProps) => {
  const { playerGameField, unDropShip } = useBattleShipStore();

  const { isHovered, isBusy, canDrop } = playerGameField[row][column];

  const styleModifiers = {
    "cell_candidate-access": isHovered && canDrop,
    "cell_candidate-failure": isHovered && !canDrop,
    "cell_busy": isBusy
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    unDropShip(row, column);
  };

  return (
    <div
      className={clsx("cell", styleModifiers, classNames)}
      data-row={row}
      data-column={column}
      onContextMenu={isBusy ? handleContextMenu : () => {}}
    />
  );
});
