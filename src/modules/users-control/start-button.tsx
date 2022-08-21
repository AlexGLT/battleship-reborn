import { useCallback } from "react";

type StartButtonProps = {
    isOpponentReady: boolean,
    areAllShipsPlaced: boolean,
    startGame: () => void,
};

export const StartButton = ({ isOpponentReady, areAllShipsPlaced, startGame }: StartButtonProps) => {
    const handleReadyButtonClick = useCallback(() => {
        if (areAllShipsPlaced && isOpponentReady) startGame();
        else console.log("Wait!");
    }, [areAllShipsPlaced, isOpponentReady]);

    return <button disabled={!isOpponentReady || !areAllShipsPlaced} onClick={handleReadyButtonClick}>Start</button>;
};
