import { useState, TransitionEvent } from "react";

interface useTransitionEndProps {
    [transitionPropertyName: string]: ((event?: TransitionEvent) => void) | undefined;
}

export const useTransitionEnd = (transitionsPropertyNames: useTransitionEndProps = {}) => {
    const [transitionEndState, setTransitionEndState] = useState(false);

    const handleTransitionStart = () => setTransitionEndState(true);

    const handleTransitionEnd = (event: TransitionEvent) => {
        const propertyName = event.propertyName;

        if (propertyName in transitionsPropertyNames) {
            transitionsPropertyNames[propertyName]?.(event);

            setTransitionEndState(false);
        }
    };

    return { transitionEndState, handleTransitionStart, handleTransitionEnd };
};
