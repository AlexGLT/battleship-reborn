import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Port } from "./port";
import { FieldPlayer } from "./field-player";
import { FieldOpponent } from "./field-opponent";

import "./battleship.scss";

export const Battleship = () => {
  return (
    <div className="battleship-container">
      <DndProvider backend={HTML5Backend}>
        <Port />
        <FieldPlayer />
        <FieldOpponent />
      </DndProvider>
    </div>
  );
};
