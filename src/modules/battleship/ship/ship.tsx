import { useDrag } from "react-dnd";

import { shipId } from "../typedefs";

import { directions } from "../constants";

import { Deck } from "./deck";

import range from "lodash-es/range";

import "./ship.scss";

interface ShipProps {
  id: shipId;
  length: number;
  direction: directions;
  isInDocks?: boolean;
}

export const Ship = ({ id, length, direction, isInDocks = false }: ShipProps) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "ship",
    canDrag: !isInDocks,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }, [isInDocks]);

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div className="ship-container" style={{ opacity }}>
      <div ref={dragRef} className={`ship ship_${direction}`} id={id}>
        {range(length).map((_, index) => (
          <Deck key={index} shipId={id} deckIndex={index} isInDocks={isInDocks} />
        ))}
      </div>
    </div>
  );
};
