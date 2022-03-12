import { DragEvent } from "react";
import { useDrop } from "react-dnd";
import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Cell } from "./cell";

import "./field-player.scss";
import { eventStages } from "../constants";

export const FieldPlayer = observer(() => {
  const { playerGameField, dropShip, draggingState: { canDrop, hoverCell, unHoverCell } } = useBattleShipStore();

  const [, dropRef] = useDrop(() => ({
    accept: "ship",
    canDrop: () => Boolean(canDrop),
    drop: () => dropShip()
  }), [canDrop]);

  const handleDragEvent = (stage: eventStages) => (event: DragEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    if (target.classList.contains("field-player__cell") ) {
      const row = Number(target.dataset.row);
      const column = Number(target.dataset.column);

      stage === eventStages.enter ? hoverCell(row, column) : unHoverCell(row, column);
    }
  };

  return (
    <div
      ref={dropRef}
      className="field-player"
      onDragEnter={handleDragEvent(eventStages.enter)}
      onDragLeave={handleDragEvent(eventStages.exit)}
    >
      {playerGameField.map((row, rowIndex) => {
        return (
          <div className="field-player__row" key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <Cell classNames="field-player__cell" row={rowIndex} column={columnIndex} key={columnIndex} />)
            )}
          </div>
        );
      })}
    </div>
  );
});
