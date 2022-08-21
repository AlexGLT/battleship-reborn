import { fieldSize } from "/constants/gameplay";

export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    [Symbol.iterator]() {
        return Object.values(this)[Symbol.iterator]();
    }
}

export class CellPosition extends Position {
    constructor(firstArg: number, secondArg?: number) {
        if (typeof secondArg !== "undefined") super(firstArg, secondArg);
        else super(Math.trunc(firstArg / fieldSize.height), firstArg % fieldSize.width);
    }

    public get index() {
        return this.x * 10 + this.y;
    }

    public static index2position = (index: number) => ([Math.trunc(index / fieldSize.height), index % fieldSize.width]);
    public static position2index = (x: number, y: number) => x * 10 + y;
}
