import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";
import { useAnimationEnd } from "/hooks";

import { DraggableShip } from "./ship";

import { DirectionButton } from "./direction-button";

export const Pier = observer(() => {
    const { shipsController: { shipInPier, toggleDirectionShipInPier } } = useRootStore();

    const {
        animationEndState,
        handleAnimationStart,
        handleAnimationEnd,
    } = useAnimationEnd({ "rotation": toggleDirectionShipInPier });

    if (!shipInPier) return null;

    const { id, length, direction } = shipInPier;

    return (
        <div className="port__pier">
            <div className="port__ship-in-pier-container">
                <DraggableShip
                    id={id}
                    length={length}
                    direction={direction}
                    rotateAnimationState={animationEndState}
                    handleRotateAnimationEnd={handleAnimationEnd}
                />
            </div>
            <DirectionButton onClick={handleAnimationStart} />
        </div>
    );
});
