import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";

// import "./home.scss";

export const Home = observer(() => {
    const navigate = useNavigate();

    const { onlineController: { createGame } } = useRootStore();

    const handleClick = () => {
        const sideEffect = (gameId: string): void => {
            navigate(`/${gameId}`, { state: { isHost: true } });
        };

        createGame(sideEffect);
    };

    return (
        <button onClick={handleClick}>Create Game</button>
    );
});
