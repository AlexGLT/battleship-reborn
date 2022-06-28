import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { configure } from "mobx";

import { StoreContext } from "./store/context";
import { RootStore } from "./store/store";

import { Main } from "./main";
import { Battleship } from "./modules";

configure({ enforceActions: "observed" });

const store = new RootStore();

const App = () => (
    <StoreContext.Provider value={store}>
        <Router>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route index element={<Battleship />} />
                </Route>
            </Routes>
        </Router>
    </StoreContext.Provider>
);

export default App;
