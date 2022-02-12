import { useDrop } from "react-dnd";
import { observer } from "mobx-react-lite";
import clsx from "clsx";

import { useBattleShipStore } from "../hooks";

import { eventStages } from "../constants";

import "./cell.scss";

interface CellProps {
  classNames?: string;
  row: number,
  column: number
}

export const Cell = observer(({ classNames, row, column }: CellProps) => {
  const { playerGameField, hoverPlayerGameField } = useBattleShipStore();

  const [, dropRef] = useDrop(() => ({
    accept: "ship",
    options: () => {
      console.log("test");
    }
  }));

  const cellState = playerGameField[row][column];

  const handleCellDragEnter = () => {
    hoverPlayerGameField(row, column, eventStages.enter);
  };

  const handleCellDragLeave = () => {
    hoverPlayerGameField(row, column, eventStages.exit);
  };

  const styleModifiers = {
    "cell_candidate-access": cellState.hover.isHovered && cellState.canDrop,
    "cell_candidate-failure": cellState.hover.isHovered && !cellState.canDrop
  };

  return (
    <div
      ref={dropRef}
      className={clsx("cell", styleModifiers, classNames)}
      onDragEnter={handleCellDragEnter}
      onDragLeave={handleCellDragLeave}
    />
  );
});
