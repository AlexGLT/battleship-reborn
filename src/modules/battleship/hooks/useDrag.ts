import { useState, useRef, PointerEvent, Dispatch, SetStateAction } from "react";

import { Position } from "../typedefs";

interface useDragProps {
    onDrop?: (params: {
        nodeStartPosition: Position | null,
        nodePosition: Position | null,
        setNodePosition: Dispatch<SetStateAction<Position | null>>
    }) => void;
}

export const useDrag = ({ onDrop }: useDragProps) => {
    const nodeRef = useRef<any>(null);

    const [isDragging, setIsDragging] = useState(false);

    const nodeStartPosition = useRef<Position | null>(null);
    const [nodePosition, setNodePosition] = useState<Position | null>(null);

    const handleOnPointerDown = (downEvent: PointerEvent<any>) => {
        const { clientX: downEventX, clientY: downEventY, target, pointerId } = downEvent;
        downEvent.preventDefault();

        const node = nodeRef.current;

        if (node) {
            setIsDragging(true);

            const { left: nodeX, top: nodeY } = node.getBoundingClientRect();
            nodeStartPosition.current = new Position(nodeX, nodeY);

            const shift = { x: downEventX - nodeX, y: downEventY - nodeY };

            setNodePosition(new Position(downEventX - shift.x, downEventY - shift.y));

            const handlePointerMove = ({ clientX: moveEventX, clientY: moveEventY }: globalThis.PointerEvent) => {
                setNodePosition(new Position(moveEventX - shift.x, moveEventY - shift.y));
            };

            const handlePointerUp = () => {
                setIsDragging(false);

                if (onDrop) onDrop({ nodePosition, nodeStartPosition: nodeStartPosition.current, setNodePosition });

                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", handlePointerUp);
            };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);

            (target as HTMLElement).releasePointerCapture(pointerId);
        }
    };

    return { nodeRef, nodePosition, isDragging, handleOnPointerDown };
};
