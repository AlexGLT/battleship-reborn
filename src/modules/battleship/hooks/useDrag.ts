import { useState, useRef, PointerEvent, Dispatch, SetStateAction } from "react";

import { position } from "../typedefs";

interface useDragProps {
  onDrop?: (params: { nodeStartPosition: position, nodePosition: position, setNodePosition: Dispatch<SetStateAction<position>> }) => void;
}

export const useDrag = ({ onDrop }: useDragProps) => {
  const nodeRef = useRef<any>(null);

  const [isDragging, setIsDragging] = useState(false);

  const nodeStartPosition = useRef<position>({ x: 0, y: 0 });
  const [nodePosition, setNodePosition] = useState<position>({ x: 0, y: 0 });

  const handleOnPointerDown = (downEvent: PointerEvent<any>) => {
    const { clientX: downEventX, clientY: downEventY, target, pointerId } = downEvent;

    downEvent.preventDefault();

    const node = nodeRef.current;

    if (node) {
      setIsDragging(true);

      const { left: nodeX, top: nodeY } = node.getBoundingClientRect();
      nodeStartPosition.current = { x: nodeX, y: nodeY };

      const shift = { x: downEventX - nodeX, y: downEventY - nodeY };

      setNodePosition({ x: downEventX - shift.x, y: downEventY - shift.y });

      const handlePointerMove = ({ clientX: moveEventX, clientY: moveEventY }: globalThis.PointerEvent) => {
        setNodePosition({ x: moveEventX - shift.x, y: moveEventY - shift.y });
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
