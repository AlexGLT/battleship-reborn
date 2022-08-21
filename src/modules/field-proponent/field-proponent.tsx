import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";

import { ProponentCell } from "./proponent-cell";

import "./field-proponent.scss";

export const FieldProponent = observer(() => {
    const { proponentField: { playerField }, dndController: { setHoverCell, shipId } } = useRootStore();

    const handlePointerLeave = () => setHoverCell(null);

    return (
        <table className="field-proponent" onPointerLeave={shipId ? handlePointerLeave : undefined}>
            <tbody>
                {playerField.map((row, rowIndex) => {
                    return (
                        <tr className="field-proponent__row" key={rowIndex}>
                            {row.map((cell, columnIndex) => (
                                <ProponentCell
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
});
