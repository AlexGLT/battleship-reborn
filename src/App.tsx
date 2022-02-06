import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Main } from "./main";
import { Battleship } from "./modules";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Battleship />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
