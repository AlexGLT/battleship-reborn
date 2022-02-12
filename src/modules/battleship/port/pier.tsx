import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Ship } from "../ship";

export const Pier = observer(() => {
  const { shipInPier: { id, length, direction, placement }, toggleDirectionShipInPier } = useBattleShipStore();

  const handleDirectionButtonClick = () => {
    toggleDirectionShipInPier();
  };

  return (
    <div className="port__pier">
      <Ship id={id} length={length} direction={direction} placement={placement} />
      <button className="port__direction-button" onClick={handleDirectionButtonClick}>Change direction</button>
    </div>
  );
});
