import { useDrag } from "react-dnd";

import { directions, locations, shipsId } from "../constants";

import { Deck } from "./deck";

import range from "lodash-es/range";

import "./ship.scss";

interface ShipProps {
  id: typeof shipsId[number],
  length: number,
  direction: directions,
  placement: locations
}

export const Ship = ({ id, length, direction, placement }: ShipProps) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "Irrelevant, for now",
    canDrag: placement !== locations.docks,
    item: { id, name: "Any custom name" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div className="ship-container" style={{ opacity }}>
      <div ref={dragRef} className={`ship ship_${direction}`} id={id}>
        {range(length).map((_, index) => <Deck key={index} shipId={id} deckIndex={index} />)}
      </div>
    </div>
  );
};
