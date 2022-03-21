import { useBattleShipStore } from "../../hooks";

import { shipId } from "../../typedefs";

interface DeckProps {
  isDraggable?: boolean;
  listeners?: {
    onDragStart?: () => void,
    onDragEnd?: () => void
  };
}

export const Deck = ({ isDraggable = false, listeners = {} }: DeckProps) => (
  <div className="ship__deck" draggable={isDraggable} {...listeners} />
);

interface DraggingDeckProps {
  deckIndex: number;
  shipId: shipId;
}

export const DraggableDeck = ({ shipId, deckIndex }: DraggingDeckProps) => {
  const { draggingState: { startDragging, stopDragging } } = useBattleShipStore();

  const handleDeckDragStart = () => startDragging(shipId, deckIndex);
  const handleDeckDragEnd = () => stopDragging();

  return <Deck
    isDraggable={true}
    listeners={{
      onDragStart: handleDeckDragStart,
      onDragEnd: handleDeckDragEnd
    }}
  />;
};
