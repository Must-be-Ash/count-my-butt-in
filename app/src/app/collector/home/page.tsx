"use client";

import EnterWalletStep from "@/app/components/collectors/EnterWalletStep";
import LeaveNoteStep from "@/app/components/collectors/LeaveNoteStep";
import ReviewAndPayStep from "@/app/components/collectors/ReviewAndPayStep";
import { useSteps } from "@/context/StepsContext";
import { useInstance } from "@/context/InstanceContext";
import { SuccessStep } from "@/app/components/collectors/SuccessStep";

export default function CollectorHome() {
  const { nft } = useInstance();
  const { currentStepIndex } = useSteps();
  return (
    <>
      {currentStepIndex === 0 ? (
        <EnterWalletStep />
      ) : currentStepIndex === 1 ? (
        <LeaveNoteStep />
      ) : currentStepIndex === 2 ? (
        <ReviewAndPayStep nft={nft} />
      ) : (
        <SuccessStep nft={nft} />
      )}
    </>
  );
}
