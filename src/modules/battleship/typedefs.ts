export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class CellPosition extends Position {
    constructor(firstArg: number, secondArg?: number) {
        if (typeof secondArg !== "undefined") {
            super(firstArg, secondArg);
        } else super(Math.trunc(firstArg / 10), firstArg % 10);
    }

    public get index() {
        return this.x * 10 + this.y;
    }

    public static position2Index = (x: number, y: number) => x * 10 + y;
}

export interface CellState {
    isHovered: boolean;
    isBusy: boolean;
    isAdjoined: boolean;
}
