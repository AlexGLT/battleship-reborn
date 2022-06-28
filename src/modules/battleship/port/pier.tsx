import { observer } from "mobx-react-lite";

import { useAnimationEnd, useBattleShipStore } from "../hooks";

import { DraggableShip } from "./ship";

import { DirectionButton } from "./direction-button";

export const Pier = observer(() => {
    const { shipInPier, toggleDirectionShipInPier } = useBattleShipStore();

    const {
        animationEndState,
        handleAnimationStart,
        handleAnimationEnd
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
