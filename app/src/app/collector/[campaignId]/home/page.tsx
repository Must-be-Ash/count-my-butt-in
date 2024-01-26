"use client";

import EnterWalletStep from "@/app/components/collectors/EnterWalletStep";
import LeaveNoteStep from "@/app/components/collectors/LeaveNoteStep";
import ReviewAndPayStep from "@/app/components/collectors/ReviewAndPayStep";
import { useSteps } from "@/context/StepsContext";
import { useInstance } from "@/context/InstanceContext";
import { SuccessStep } from "@/app/components/collectors/SuccessStep";
import { useEffect } from "react";
import TipStep from "@/app/components/collectors/TipStep";

export default function CollectorHome({
  params,
}: {
  params: { campaignId: string };
}) {
  const { instance, setInstance } = useInstance();
  const { currentStepIndex } = useSteps();

  useEffect(() => {
    setInstance({
      ...instance,
      campaignId: params.campaignId,
    });
  }, [params]);

  return (
    <>
      {currentStepIndex === 0 ? (
        <EnterWalletStep />
      ) : currentStepIndex === 1 ? (
        <LeaveNoteStep />
      ) : currentStepIndex === 2 ? (
        <TipStep />
      ) : currentStepIndex === 3 ? (
        <ReviewAndPayStep />
      ) : (
        <SuccessStep />
      )}
    </>
  );
}
