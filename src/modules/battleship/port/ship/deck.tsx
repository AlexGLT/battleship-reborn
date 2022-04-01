import { useBattleShipStore } from "../../hooks";

interface DeckProps {
  listeners?: {
    onPointerDown?: () => void
  };
}

export const Deck = ({ listeners }: DeckProps) => (
  <div className="ship__deck" onPointerDown={listeners?.onPointerDown} />
);

interface DraggingDeckProps {
  deckIndex: number;
  shipId: string;
}

export const DraggableDeck = ({ shipId, deckIndex }: DraggingDeckProps) => {
  const { draggingState: { startDragging } } = useBattleShipStore();

  const handlePointerDown = () => startDragging(shipId, deckIndex);

  return <Deck listeners={{ onPointerDown: handlePointerDown }} />;
};
