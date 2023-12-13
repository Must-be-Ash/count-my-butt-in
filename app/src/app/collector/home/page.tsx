"use client";

import EnterWalletStep from "@/app/components/collectors/enterWalletStep";
import LeaveNoteStep from "@/app/components/collectors/leaveNoteStep";
import ReviewAndPayStep from "@/app/components/collectors/reviewAndPayStep";
import { useSteps } from "@/context/StepsContext";
import { useSelectedNft } from "@/context/SelectedNftContext";

export default function CollectorHome() {
  const { nft } = useSelectedNft();
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
