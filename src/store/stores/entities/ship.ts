import { makeAutoObservable } from "mobx";

import { Direction } from "/constants/ship";

export class Ship {
    public id: string;
    public length: number;
    public direction: Direction;

    constructor(id: string, length: number, direction = Direction.horizontal) {
        this.id = id;
        this.length = length;
        this.direction = direction;

        makeAutoObservable(this);
    }

    public toggleDirection = () => {
        this.direction = this.direction === Direction.horizontal ? Direction.vertical : Direction.horizontal;
    };
}
