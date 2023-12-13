import { useSteps } from "@/context/StepsContext";
import LogoutButton from "./logoutButton";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

export default function CollectorTopNav() {
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
    <nav aria-label="Progress" className="py-4">
      <div className="flex flex-row justify-between mb-5">
        {currentStepIndex > 0 ? (
          <ArrowLeftIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => setCurrentStepIndex(0)}
          />
        ) : (
          <div />
        )}
        <LogoutButton />
      </div>
      <ol role="list" className=" md:flex md:space-x-2 grow pt-2">
        {allSteps.map((step) => (
          <li key={step.id} className="md:flex-1">
            {step.status === "complete" ? (
              <div className="group flex flex-col border-l-4 border-green-400 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                {" "}
                <span className="w-14" />
              </div>
            ) : step.status === "current" ? (
              <div
                className="flex flex-col border-l-4 border-green-400 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="w-14" />
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-gray-400 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="w-14" />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
