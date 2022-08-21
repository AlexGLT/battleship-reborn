import { Direction, shipDirection } from "/constants/ship";

import { Deck } from "./deck";

import clsx from "clsx";
import range from "lodash-es/range";

import "./ship.scss";

export interface ShipProps {
    className?: string;
    length: number;
    direction?: Direction;
}

export const Ship = ({ className, length, direction = Direction.horizontal }: ShipProps) => {
    console.log(direction);

    return (
        <div className={clsx("ship", `ship_${shipDirection[direction]}`, className)}>
            {range(length).map((_, index) => <Deck key={index} />)}
        </div>
    );
};

