import { directions } from "../../constants";

import { Deck } from "./deck";

import clsx from "clsx";
import range from "lodash-es/range";

import "./ship.scss";

export interface ShipProps {
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

