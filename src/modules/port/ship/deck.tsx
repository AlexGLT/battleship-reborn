import { useRootStore } from "/store";

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
    const { dndController: { startDragging } } = useRootStore();

    const handlePointerDown = () => startDragging(shipId, deckIndex);

    return <Deck listeners={{ onPointerDown: handlePointerDown }} />;
};
