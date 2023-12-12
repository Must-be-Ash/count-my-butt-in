import { useSteps } from "@/context/StepsContext";
import LogoutButton from "./logoutButton";
import { useEffect } from "react";

const steps = [
  { id: "Step 1", status: "current" },
  { id: "Step 2", status: "upcoming" },
  { id: "Step 3", status: "upcoming" },
];

export default function CollectorTopNav() {
  const { currentStepIndex } = useSteps();
  useEffect(() => {
    steps.forEach((step, index) => {
      if (currentStepIndex > index) step.status = "complete";
      if (currentStepIndex < index) step.status = "upcoming";
      if (currentStepIndex === index) step.status = "current";
    });
  });
  return (
    <nav aria-label="Progress" className="py-4">
      <ol role="list" className="space-y-4 md:flex md:space-x-2 md:space-y-0">
        {steps.map((step) => (
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
      <div className="absolute right-0 top-0">
        <LogoutButton />
      </div>
    </nav>
  );
}
