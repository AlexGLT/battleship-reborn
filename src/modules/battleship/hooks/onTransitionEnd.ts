import { TransitionEvent, useState } from "react";

interface useTransitionEndProps {
  transitionEndCallback?: (event?: TransitionEvent) => void;
  transitionPropertyNames?: string[];
}

export const useTransitionEnd = ({ transitionEndCallback, transitionPropertyNames = [] }: useTransitionEndProps = {}) => {
  const [transitionEndState, setTransitionEndState] = useState(false);

  const handleTransitionStart = () => setTransitionEndState(true);

  const handleTransitionEnd = (event: TransitionEvent) => {
    if (transitionPropertyNames.includes(event.propertyName)) {
      if (transitionEndCallback) transitionEndCallback(event);

      setTransitionEndState(false);
    }
  };

  return { transitionEndState, handleTransitionStart, handleTransitionEnd };
};
