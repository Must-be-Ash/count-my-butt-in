"use client";

import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { useInstance } from "@/context/InstanceContext";

export default function CollectorNote() {
  const { setInstance } = useInstance();
  const { setCurrentStepIndex } = useSteps();
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-4 grow">
        <h1>Leave a note for the artist (optional)</h1>
        <div className="text-sm text-neutral-500">
          What do you want the artist to draw, write or sign? Who do you want
          them to make it out to?
        </div>
        <div className="flex flex-row w-full">
          <div className="grow">
            <label htmlFor="search" className="sr-only">
              enter address
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder="Enter a note"
              maxLength={140}
              className="block w-full max-w-2xl pl-2 placeholder:pl-2 rounded-md border-0 py-1.5 text-white bg-neutral-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              defaultValue={""}
              onChange={(e) => setInstance({ note: e.target.value })}
            />
          </div>
        </div>
        <div className="text-sm text-neutral-500 ml-auto">0/140</div>
      </div>

      <BinderButton
        primary={false}
        title="Next"
        onClick={() => setCurrentStepIndex(2)}
      />
    </div>
  );
}
