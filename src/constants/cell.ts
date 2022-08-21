export enum CellStatus {
    none,
    isHovered,
    canDrop,
    cantDrop,
    isCollided,
    isBusy,
    isAdjoined,
    isShotMiss,
    isShotHit,
    isShipKilled,
}

export const cellStyle = {
    [CellStatus.none]: "",
    [CellStatus.isHovered]: "hovered",
    [CellStatus.canDrop]: "can-drop",
    [CellStatus.cantDrop]: "cant-drop",
    [CellStatus.isCollided]: "collision",
    [CellStatus.isBusy]: "busy",
    [CellStatus.isAdjoined]: "side",
    [CellStatus.isShotMiss]: "shot-miss",
    [CellStatus.isShotHit]: "shot-hit",
    [CellStatus.isShipKilled]: "killed",
} as const;
