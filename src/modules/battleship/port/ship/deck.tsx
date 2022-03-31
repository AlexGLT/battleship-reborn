import { useBattleShipStore } from "../../hooks";

import { shipId } from "../../typedefs";

interface DeckProps {
  listeners?: {
    onPointerDown?: () => void
  };
}

export const Deck = ({ listeners }: DeckProps) => (
  <div
    className="ship__deck"
    onDragStart={undefined}
    onPointerDown={listeners?.onPointerDown}
  />
);

interface DraggingDeckProps {
  deckIndex: number;
  shipId: shipId;
}

export const DraggableDeck = ({ shipId, deckIndex }: DraggingDeckProps) => {
  const { draggingState: { startDragging } } = useBattleShipStore();

  const handlePointerDown = () => startDragging(shipId, deckIndex);

  return <Deck listeners={{ onPointerDown: handlePointerDown }} />;
};
