import "./field-player.scss";
import { useBattleShipStore } from "../hooks";

import { Cell } from "./cell";

export const FieldPlayer = () => {
  const { playerGameField } = useBattleShipStore();

  return (
    <div className="field-player">
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
};
