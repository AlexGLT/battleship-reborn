import { useCallback } from "react";

type ReadyButtonProps = {
    isReady: boolean,
    areAllShipsPlaced: boolean,
    changeReadiness: () => void,
};

export const ReadyButton = ({ isReady, areAllShipsPlaced, changeReadiness }: ReadyButtonProps) => {
    const handleReadyButtonClick = useCallback(() => {
        if (areAllShipsPlaced) changeReadiness();
        else console.log("Place all ships!");
    }, [areAllShipsPlaced]);

    return <button disabled={isReady || !areAllShipsPlaced} onClick={handleReadyButtonClick}>Ready</button>;
};
