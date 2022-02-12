import { makeAutoObservable } from "mobx";

import { shipId } from "../typedefs";

import { eventStages } from "../constants";

export class Cell {
  public index: number;
  public shipId: shipId | null = null;
  public isShot: boolean = false;
  public isBusy: boolean = false;

  public canDrop: boolean | null = null;

  public hover: {
    isHovered: boolean,
    triggeredByCell: [number, number] | []
  } = { isHovered: false, triggeredByCell: [] };

  constructor(index: number) {
    this.index = index;

    makeAutoObservable(this);
  }

  handleHover = (triggeredByCell: [number, number], stage: eventStages, canDrop: boolean) => {
    if (stage === eventStages.enter) {
      this.hover.triggeredByCell = triggeredByCell;
      this.hover.isHovered = true;
      this.canDrop = canDrop;
    } else {
      const [triggeredCellRow, triggeredCellColumn] = this.hover.triggeredByCell;

      if (triggeredCellRow === triggeredByCell[0] && triggeredCellColumn === triggeredByCell[1]) {
        this.hover.triggeredByCell = [];
        this.hover.isHovered = false;
        this.canDrop = null;
      }
    }
  };
}
