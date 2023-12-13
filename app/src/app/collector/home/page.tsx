"use client";

import EnterWalletStep from "@/app/components/collectors/enterWalletStep";
import LeaveNoteStep from "@/app/components/collectors/leaveNoteStep";
import ReviewAndPayStep from "@/app/components/collectors/reviewAndPayStep";
import { useSteps } from "@/context/StepsContext";
import { useInstance } from "@/context/InstanceContext";

export default function CollectorHome() {
  const { nft } = useInstance();
  const { currentStepIndex } = useSteps();
  return (
    <>
      {currentStepIndex === 0 ? (
        <EnterWalletStep />
      ) : currentStepIndex === 1 ? (
        <LeaveNoteStep />
      ) : (
        <ReviewAndPayStep nft={nft} />
      )}
    </>
  );
}
