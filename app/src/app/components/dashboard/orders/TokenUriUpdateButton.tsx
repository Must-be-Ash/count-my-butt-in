"use client";

import { useEffect } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { BINDER_DROP_ABI } from "@/abi";
import { useWrite } from "@/hooks/web3";

export default function TokenUriUpdateButton({
  revealedTokenIdBoundary,
  revealedURI,
  campaignNetworkId,
  binderContract,
}: {
  campaignNetworkId: number;
  revealedTokenIdBoundary: number;
  revealedURI: string;
  binderContract: string;
}) {
  const { instance, setInstance } = useInstance();
  const {
    write,
    error,
    isLoading,
    data,
    switchCorrectNetwork,
    wrongNetwork,
    isSuccess,
    parsed,
  } = useWrite({
    networkId: campaignNetworkId,
    contractAddress: binderContract,
    abi: BINDER_DROP_ABI,
    functionName: "revealTokens",
    args: [revealedTokenIdBoundary, revealedURI],
  });

  async function mint() {
    if (write) {
      // create new order
      await write();
    }
  }

  useEffect(() => {
    if (isSuccess) {
      console.log("success!");
    }
  }, [isSuccess, parsed, setInstance]);

  return (
    <>
      <BinderButton
        onClick={!wrongNetwork ? () => mint() : () => switchCorrectNetwork()}
        isLoading={isLoading}
      >{wrongNetwork ? "Switch network" : "Submit"}</BinderButton>
      <ErrorDisplay error={error} />
    </>
  );
}
