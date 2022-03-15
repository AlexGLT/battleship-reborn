import { useBattleShipStore } from "../hooks";

import { shipId } from "../typedefs";

interface DeckProps {
  shipId: shipId;
  deckIndex: number;
  isInDocks?: boolean;
}

export const Deck = ({ shipId, deckIndex, isInDocks = true }: DeckProps) => {
  const { draggingState: { startDragging, stopDragging } } = useBattleShipStore();

  if (isInDocks) return (<div className="ship__deck" />);

  const handleDeckDragStart = () => startDragging(shipId, deckIndex);
  const handleDeckDragEnd = () => stopDragging();

  return (
    <div
      className="ship__deck"
      draggable={true}
      onDragStart={handleDeckDragStart}
      onDragEnd={handleDeckDragEnd} />
  );
};
