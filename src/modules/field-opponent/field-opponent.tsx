import { useRootStore } from "/store";

import { OpponentCell } from "./opponent-cell";

import "./field-opponent.scss";

export const FieldOpponent = () => {
    const { opponentField: { playerField } } = useRootStore();

    return (
        <table className="field-opponent">
            <tbody>
                {playerField.map((row, rowIndex) => {
                    return (
                        <tr className="field-opponent__row" key={rowIndex}>
                            {row.map((cell, columnIndex) => (
                                <OpponentCell
                                    key={columnIndex}
                                    row={rowIndex}
                                    column={columnIndex}
                                />
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
