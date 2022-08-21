import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";
import { useLocationState } from "/hooks";

import { Port } from "/modules";
import { FieldProponent } from "/modules";
import { FieldOpponent } from "/modules";
import { UsersControl } from "/modules";

import "./lobby.scss";

type LocationStateType = {
    isHost: boolean | void
};

export const Lobby = observer(() => {
    const { isHost } = useLocationState<LocationStateType>();
    const { gameId } = useParams();

    const { onlineController: { joinGame, proponentState: { isJoined } } } = useRootStore();

    useEffect(() => {
        if (!isHost && gameId) {
            joinGame(gameId);
        }
    }, [isHost, gameId]);

    return (
        <>
            {isJoined ? (
                <div className="battleship-container">
                    <Port />
                    <FieldProponent />
                    <FieldOpponent />
                    <UsersControl isHost={isHost} />
                </div>
            ) : "Not allowed!"}
        </>
    );
});
