import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";

import { Users } from "./users";
import { StartButton } from "./start-button";
import { ReadyButton } from "./ready-button";

import type { ReactElement } from "react";

type UsersControlProps = {
    isHost: boolean | void;
}

export const UsersControl = observer(({ isHost }: UsersControlProps): ReactElement => {
    const {
        shipsController: { areAllShipsPlaced },
        onlineController: {
            isGameStarted, changeReadiness, startGame,
            proponentState: { isReady: isProponentReady },
            opponentState: { isJoined: isOpponentJoined, isReady: isOpponentReady },
        },
    } = useRootStore();

    const isReady = !!isProponentReady;

    if (isGameStarted) {
        return (
            <div>
                <Users {...{ isHost, isProponentReady, isOpponentJoined, isOpponentReady }} />
            </div>
        );
    }

    return (
        <div>
            <Users {...{ isHost, isProponentReady, isOpponentJoined, isOpponentReady }} />
            {isHost ? (
                <StartButton {...{ areAllShipsPlaced, isOpponentReady, startGame }} />
            ) : (
                <ReadyButton {...{ isReady, areAllShipsPlaced, changeReadiness }} />
            )}
        </div>
    );
});
