import { AnimationEvent } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { observer } from "mobx-react-lite";

import { useBattleShipStore, useDrag, useTransitionEnd } from "../../hooks";

import { shipId } from "../../typedefs";

import { directions } from "../../constants";

import clsx from "clsx";
import range from "lodash-es/range";

import { DraggableDeck } from "./deck";

interface DraggingShipProps {
  id: shipId;
  length: number;
  direction: directions;
  rotateAnimationState: boolean;
  handleRotateAnimationEnd: (event: AnimationEvent) => void;
}

export const DraggableShip = observer((
  { id, length, direction, rotateAnimationState, handleRotateAnimationEnd }: DraggingShipProps) => {
  const { dropShip, draggingState: { isOverPlayerField } } = useBattleShipStore();

  const {
    transitionEndState: dropFailAnimationState,
    handleTransitionStart,
    handleTransitionEnd: handleDropFailAnimationEnd
  } = useTransitionEnd({ transitionPropertyNames: ["left", "top"] });

  const { nodeRef, nodePosition, isDragging, handleOnPointerDown } = useDrag({
    onDrop: ({ setNodePosition, nodeStartPosition }) => {
      const success = dropShip();

      if (!success) {
        setNodePosition(nodeStartPosition);

        handleTransitionStart();
      }
    }
  });

  const shipClassNames = clsx("ship", `ship_${direction}`, {
    "ship_rotated": rotateAnimationState,
    "ship_dragging": isDragging,
    "ship_drop-fail": dropFailAnimationState,
    "ship_over-field": isOverPlayerField
  });

  return (
    <SwitchTransition>
      <CSSTransition key={id} nodeRef={nodeRef} timeout={{ enter: 500, exit: 0 }} classNames="ship-dragging">
        <div
          ref={nodeRef}
          style={{
            left: `${nodePosition.x}px`,
            top: `${nodePosition.y}px`
          }}
          onDragStart={undefined}
          onPointerDown={handleOnPointerDown}
          className={shipClassNames}
          onAnimationEnd={handleRotateAnimationEnd}
          onTransitionEnd={handleDropFailAnimationEnd}
        >
          {range(length).map((_, index) => <DraggableDeck key={index} shipId={id} deckIndex={index} />)}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
});
