import { Port } from "./port";
import { FieldPlayer } from "./field-player";
import { FieldOpponent } from "./field-opponent";

import "./battleship.scss";

export const Battleship = () => (
    <div className="battleship-container">
        <Port />
        <FieldPlayer />
        <FieldOpponent />
    </div>
);
