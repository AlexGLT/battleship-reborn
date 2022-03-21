import { AnimationEvent } from "react";
import { useDrag } from "react-dnd";

import { shipId } from "../../typedefs";

import { directions } from "../../constants";

import { Deck, DraggableDeck } from "../deck";

import clsx from "clsx";
import range from "lodash-es/range";

import "./ship.scss";

interface ShipProps {
  className?: string;
  length: number;
  direction?: directions;
}

export const Ship = ({ className, length, direction = directions.horizontal }: ShipProps) => {
  return (
    <div className={clsx("ship", `ship_${direction}`, className)}>
      {range(length).map((_, index) => <Deck key={index} />)}
    </div>
  );
};

interface DraggingShipProps extends ShipProps {
  id: shipId;
  onAnimationEnd?: (() => void) | ((event: AnimationEvent) => void);
}

export const DraggableShip = ({ className, id, length, direction, onAnimationEnd }: DraggingShipProps) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "ship",
    item: { id },
    canDrag: !onAnimationEnd,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }, [onAnimationEnd]);

  return (
    <div
      ref={dragRef}
      className={clsx("ship", `ship_${direction}`, className, { "ship_dragging": isDragging })}
      onAnimationEnd={onAnimationEnd}
    >
      {range(length).map((_, index) => <DraggableDeck key={index} shipId={id} deckIndex={index} />)}
    </div>
  );
};
