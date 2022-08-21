import { Link, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useRootStore } from "/store";

import "./main.scss";

export const Main = observer(() => {
    const { onlineController: { proponentState: { isConnected } } } = useRootStore();

    return (
        <>
            <header className={"header"}>
                <Link to="/">Battleship!</Link>
            </header>
            {isConnected ? (
                <main className={"main"}>
                    <Outlet />
                </main>
            ) : "Loading..."}
        </>
    );
});
