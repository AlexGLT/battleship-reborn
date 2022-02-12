import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Ship } from "../ship";

export const Pier = observer(() => {
  const { shipInPier, toggleDirectionShipInPier } = useBattleShipStore();

  const handleDirectionButtonClick = () => {
    toggleDirectionShipInPier();
  };

  if (!shipInPier) {
    return null;
  }

  const { id, length, direction } = shipInPier;

  return (
    <div className="port__pier">
      <Ship id={id} length={length} direction={direction} />
      <button className="port__direction-button" onClick={handleDirectionButtonClick}>Change direction</button>
    </div>
  );
});
