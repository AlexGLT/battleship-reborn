import { useState, TransitionEvent } from "react";

interface useTransitionEndProps {
  [transitionPropertyName: string]: ((event?: TransitionEvent) => void) | undefined;
}

export const useTransitionEnd = (transitionsPropertyNames: useTransitionEndProps = {}) => {
  const [transitionEndState, setTransitionEndState] = useState(false);

  const handleTransitionStart = () => setTransitionEndState(true);

  const handleTransitionEnd = (event: TransitionEvent) => {
    const transitionEndCallback = transitionsPropertyNames[event.propertyName];

    if (transitionEndCallback) transitionEndCallback(event);

    setTransitionEndState(false);
  };

  return { transitionEndState, handleTransitionStart, handleTransitionEnd };
};
