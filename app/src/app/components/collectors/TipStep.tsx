"use client";

import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { useInstance } from "@/context/InstanceContext";

export default function TipStep() {
  const { setInstance } = useInstance();
  const { setCurrentStepIndex } = useSteps();
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl">Tip 🫶(optional)</h1>
        <div className=" text-neutral-500 font-bold">
          100% of your tips goes to Jayden. We highly recommend tipping!
        </div>
        <div className=" text-neutral-500">
          Artists, musicians, celebrities and athlete’s signatures add value
          (sentimental/financial) to your collectables and it would be very kind
          of you to make them feel rewarded too.
        </div>
        <div className="flex flex-row w-full mt-4">
          <div className="flex flex-col items-center w-full">
            <label htmlFor="search" className="mx-auto text-neutral-500 mb-5">
              Enter amount (ETH)
            </label>
            <input
              type="float"
              name="price"
              required
              id="price"
              className="block w-full pl-2 placeholder:pl-2 rounded-md border-0 py-1.5 text-white bg-neutral-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="0.001"
              onChange={(e) =>
                // @ts-ignore
                setInstance({ tipAmount: e.target.value as unknown as number })
              }
            />
          </div>
        </div>
      </div>

      <BinderButton onClick={() => setCurrentStepIndex(3)}>Next</BinderButton>
    </div>
  );
}
