import { useBattleShipStore } from "../hooks";

import { shipId } from "../typedefs";

interface DeckProps {
  shipId: shipId;
  deckIndex: number;
}

export const Deck = ({ shipId, deckIndex }: DeckProps) => {
  const { startShipDragging, stopShipDragging } = useBattleShipStore();

  const handleDeckDragStart = () => {
    startShipDragging(shipId, deckIndex);
  };

  const handleDeckDragEnd = () => {
    stopShipDragging();
  };

  return (
    <div className="ship__deck" draggable={true} onDragStart={handleDeckDragStart} onDragEnd={handleDeckDragEnd} />
  );
};
