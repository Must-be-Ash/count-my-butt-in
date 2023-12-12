import * as React from "react";
import {
  createContext,
  useContext,
  Context,
  SetStateAction,
  Dispatch,
} from "react";

const stepsContext = createContext({
  currentStepIndex: 0,
  setCurrentStepIndex: (value: SetStateAction<number>) => {},
});

export function StepProvider({ children }: { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  return (
    <stepsContext.Provider value={{ currentStepIndex, setCurrentStepIndex }}>
      {children}
    </stepsContext.Provider>
  );
}

export const useSteps = () => useContext(stepsContext);
