import { ChangeEvent } from "react";

import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Cell } from "./cell";

import "./field-player.scss";

export const FieldPlayer = observer(() => {
    const { playerFieldState: { playerField }, draggingState: { setHoverCell, shipId } } = useBattleShipStore();

    const handlePointerLeave = () => setHoverCell(null);

    return (
        <table className="field-player" onPointerLeave={shipId ? handlePointerLeave : undefined}>
            <tbody>
                {playerField.map((row, rowIndex) => {
                    return (
                        <tr className="field-player__row" key={rowIndex}>
                            {row.map((cell, columnIndex) => (
                                <Cell
                                    key={columnIndex}
                                    classNames="field-player__cell"
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
});
