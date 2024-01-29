import { useSteps } from "@/context/StepsContext";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function CollectorTopNav() {
  const { authenticated } = useAuthentication();
  const { currentStepIndex, setCurrentStepIndex } = useSteps();

  const [allSteps, setAllSteps] = useState([
    { id: "Step 1", status: "current" },
    { id: "Step 2", status: "upcoming" },
    { id: "Step 3", status: "upcoming" },
  ]);

  useEffect(() => {
    const nextSteps = [...allSteps];
    nextSteps.forEach((step, index) => {
      if (currentStepIndex > index) nextSteps[index].status = "complete";
      if (currentStepIndex < index) nextSteps[index].status = "upcoming";
      if (currentStepIndex === index) nextSteps[index].status = "current";
      setAllSteps(nextSteps);
    });
  }, [currentStepIndex]);

  return (
    <nav aria-label="Progress" className="pb-4 w-full">
      <div className="flex flex-row justify-between mb-5">
        {currentStepIndex > 0 ? (
          <ArrowLeftIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => setCurrentStepIndex(0)}
          />
        ) : (
          <div />
        )}
        {authenticated && <LogoutButton size="sm" />}
      </div>
      <ol role="list" className="flex space-x-2 grow pt-2">
        {allSteps.map((step) => (
          <li key={step.id} className="flex-1">
            {step.status === "complete" ? (
              <div className="group flex flex-col border-green-400 py-2 hover:border-indigo-800 border-l-0 border-t-4 pb-0 pl-0 pt-4">
                {" "}
                <span className="w-14" />
              </div>
            ) : step.status === "current" ? (
              <div
                className="flex flex-col border-green-400 py-2 border-l-0 border-t-4 pb-0 pl-0 pt-4"
                aria-current="step"
              >
                <span className="w-14" />
              </div>
            ) : (
              <div className="group flex flex-col border-gray-400 py-2 hover:border-gray-300 border-l-0 border-t-4 pb-0 pl-0 pt-4">
                <span className="w-14" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
