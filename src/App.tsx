import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { configure } from "mobx";

import { StoreContext } from "./store";
import { RootStore } from "./store";

import { Main } from "./main";
import { Home, Lobby } from "./pages";

configure({ enforceActions: "observed" });

const store = new RootStore();

const App = () => (
    <StoreContext.Provider value={store}>
        <Router>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route index element={<Home />} />
                    <Route path="/:gameId" element={<Lobby />} />
                </Route>
            </Routes>
        </Router>
    </StoreContext.Provider>
);

export default App;
