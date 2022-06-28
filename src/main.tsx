import { Outlet } from "react-router-dom";

import "./main.scss";

export const Main = () => (
    <>
        <header className={"header"}>
            Battleship!
        </header>
        <main className={"main"}>
            <Outlet />
        </main>
    </>
);
