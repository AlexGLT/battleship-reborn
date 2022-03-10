import { DragEvent } from "react";
import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { eventStages } from "../constants";

import { Cell } from "./cell";

import "./field-player.scss";

export const FieldPlayer = observer(() => {
  const { playerGameField, hoverPlayerGameField } = useBattleShipStore();

  const handleDragEvent = (stage: eventStages) => (event: DragEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;

    if (target.classList.contains("field-player__cell")) {
      const row = Number(target.dataset.row);
      const column = Number(target.dataset.column);

      hoverPlayerGameField(row, column, stage);
    }
  };

  return (
    <div
      className="field-player"
      onDragEnter={handleDragEvent(eventStages.enter)}
      onDragLeave={handleDragEvent(eventStages.exit)}>
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
