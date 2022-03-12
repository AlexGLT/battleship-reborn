import { useBattleShipStore } from "../hooks";

import { shipId } from "../typedefs";

interface DeckProps {
  shipId: shipId;
  deckIndex: number;
}

export const Deck = ({ shipId, deckIndex }: DeckProps) => {
  const { draggingState: { startDragging, stopDragging } } = useBattleShipStore();

  const handleDeckDragStart = () => {
    startDragging(shipId, deckIndex);
  };

  const handleDeckDragEnd = () => {
    stopDragging();
  };

  return (
    <div className="ship__deck" draggable={true} onDragStart={handleDeckDragStart} onDragEnd={handleDeckDragEnd} />
  );
};
