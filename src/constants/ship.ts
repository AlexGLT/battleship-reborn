export enum Direction {
    horizontal,
    vertical,
}

export const shipDirection = {
    [Direction.horizontal]: "horizontal",
    [Direction.vertical]: "vertical",
} as const;
