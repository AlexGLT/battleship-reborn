import { useDrop } from "react-dnd";
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
  const { playerGameField } = useBattleShipStore();

  const [, dropRef] = useDrop(() => ({
    accept: "ship",
    options: () => {
      console.log("test");
    }
  }));

  const cellState = playerGameField[row][column];

  const styleModifiers = {
    "cell_candidate-access": cellState.hover.isHovered && cellState.canDrop,
    "cell_candidate-failure": cellState.hover.isHovered && !cellState.canDrop
  };

  return (
    <div
      ref={dropRef}
      className={clsx("cell", styleModifiers, classNames)}
      data-row={row}
      data-column={column}
    />
  );
});
