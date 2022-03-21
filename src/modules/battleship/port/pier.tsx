import { observer } from "mobx-react-lite";

import { useAnimationEnd, useBattleShipStore } from "../hooks";

import { DraggableShip } from "../components";

import { DirectionButton } from "./direction-button";

export const Pier = observer(() => {
  const { shipInPier, toggleDirectionShipInPier } = useBattleShipStore();

  const { animationState, handleAnimationStart, handleAnimationEnd } = useAnimationEnd(toggleDirectionShipInPier);

  if (!shipInPier) return null;

  const { id, length, direction } = shipInPier;

  const conditionalProps = animationState ? {
    className: "ship_rotated",
    onAnimationEnd: handleAnimationEnd
  } : {};

  return (
    <div className="port__pier">
      <div className="port__ship-in-pier-container">
        <DraggableShip id={id} length={length} direction={direction} {...conditionalProps} />
      </div>
      <DirectionButton onClick={handleAnimationStart} />
    </div>
  );
});
