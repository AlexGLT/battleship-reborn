import { useState, AnimationEvent } from "react";

interface useAnimationEndProps {
  [animationName: string]: ((event?: AnimationEvent) => void) | undefined;
}

export const useAnimationEnd = (animationNames: useAnimationEndProps = {}) => {
  const [animationEndState, setAnimationEndState] = useState(false);

  const handleAnimationStart = () => setAnimationEndState(true);

  const handleAnimationEnd = (event: AnimationEvent) => {
    const animationEndCallback = animationNames[event.animationName];

    if (animationEndCallback) animationEndCallback(event);

    setAnimationEndState(false);
  };

  return { animationEndState, handleAnimationStart, handleAnimationEnd };
};
