import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Cell } from "./cell";

import "./field-player.scss";

export const FieldPlayer = observer(() => {
  const { playerGameField, draggingState: { shipId } } = useBattleShipStore();

  return (
    <table className="field-player">
      <tbody>
        {playerGameField.map((row, rowIndex) => {
          return (
            <tr className="field-player__row" key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <Cell
                  key={columnIndex}
                  classNames="field-player__cell"
                  row={rowIndex}
                  column={columnIndex}
                  startDragging={!shipId}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
