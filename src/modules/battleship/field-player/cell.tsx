import { observer } from "mobx-react-lite";
import clsx from "clsx";

import { useBattleShipStore } from "../hooks";

import "./cell.scss";
import { eventStages } from "../constants";

interface CellProps {
  classNames?: string;
  row: number,
  column: number
}

export const Cell = observer(({ classNames, row, column }: CellProps) => {
  const { getCell, hoverPlayerGameField } = useBattleShipStore();

  const cellState = getCell(row, column);

  const handleCellDragEnter = () => {
    setTimeout(() => {
      hoverPlayerGameField(row, column, eventStages.enter);
    });
  };

  const handleCellDragLeave = () => {
    hoverPlayerGameField(row, column, eventStages.exit);
  };

  const styleModifiers = {
    "cell_candidate-access": cellState.isHovered && cellState.canDrop,
    "cell_candidate-failure": cellState.isHovered && !cellState.canDrop
  };

  return (
    <div
      className={clsx("cell", styleModifiers, classNames)}
      onDragEnterCapture={handleCellDragEnter}
      onDragLeave={handleCellDragLeave}
    />
  );
});
