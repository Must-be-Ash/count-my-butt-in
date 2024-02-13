"use client";

import { useEffect } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { BINDER_DROP_ABI } from "@/abi";
import { useWrite } from "@/hooks/web3";

export default function BatchMint({
  orderIds,
  campaignNetworkId,
  binderContract,
  recipients,
  signature,
  uris,
  nonce,
}: {
  orderIds: string[];
  campaignNetworkId: number;
  binderContract: string;
  recipients: string[];
  signature: string;
  uris: string[];
  nonce: string;
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
    contractAddress: "0xafEC54C54A1a326ebe61357eAaFfD4A73eA1abE6",
    abi: BINDER_DROP_ABI,
    functionName: "mintToBatch",
    args: [orderIds, recipients, signature, uris, nonce],
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
      >
        {wrongNetwork ? "Switch network" : "Submit"}
      </BinderButton>
      <ErrorDisplay error={error} />
    </>
  );
}
