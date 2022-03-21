import { useState, AnimationEvent } from "react";

export const useAnimationEnd = (animationEndCallback: (() => void) | ((event: AnimationEvent) => void)) => {
  const [animationState, setAnimationState] = useState(false);

  const handleAnimationStart = () => setAnimationState(true);
  const handleAnimationEnd = (event: AnimationEvent) => {
    animationEndCallback(event);

    setAnimationState(false);
  };

  return { animationState, handleAnimationStart, handleAnimationEnd };
};
