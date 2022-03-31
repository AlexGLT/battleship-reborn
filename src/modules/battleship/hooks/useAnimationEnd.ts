import { useState, AnimationEvent } from "react";

export const useAnimationEnd = (animationEndCallback: (event?: AnimationEvent) => void) => {
  const [animationEndState, setAnimationEndState] = useState(false);

  const handleAnimationStart = () => setAnimationEndState(true);
  const handleAnimationEnd = (event: AnimationEvent) => {
    animationEndCallback(event);

    setAnimationEndState(false);
  };

  return { animationEndState, handleAnimationStart, handleAnimationEnd };
};
