import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Cell } from "./cell";

import "./field-player.scss";

export const FieldPlayer = observer(() => {
  const { playerGameField } = useBattleShipStore();

  return (
    // <div className="field-player">
    //   {playerGameField.map((row, rowIndex) => {
    //     return (
    //       <div className="field-player__row" key={rowIndex}>
    //         {row.map((cell, columnIndex) => (
    //           <Cell classNames="field-player__cell" row={rowIndex} column={columnIndex} key={columnIndex} />)
    //         )}
    //       </div>
    //     );
    //   })}
    // </div>
    <table className="field-player">
      <tbody>
        {playerGameField.map((row, rowIndex) => {
          return (
            <tr className="field-player__row" key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <Cell classNames="field-player__cell" row={rowIndex} column={columnIndex} key={columnIndex} />)
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
