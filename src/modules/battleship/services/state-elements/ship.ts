import { makeAutoObservable } from "mobx";

import { directions } from "../../constants";

export class Ship {
    public id: string;
    public length: number;
    public direction: directions;

    constructor(id: string, length: number, direction = directions.horizontal) {
        this.id = id;
        this.length = length;
        this.direction = direction;

        makeAutoObservable(this);
    }

    public toggleDirection = () => {
        this.direction = this.direction === directions.horizontal ? directions.vertical : directions.horizontal;
    };
}
