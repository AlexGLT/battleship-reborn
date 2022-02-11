import { Docks } from "./docks";
import { Pier } from "./pier";

import "./port.scss";

export const Port = () => {
  return (
    <div className="port">
      <Docks />
      <Pier />
    </div>
  );
};
