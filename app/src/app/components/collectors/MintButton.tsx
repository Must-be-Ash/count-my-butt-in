"use client";

import { useEffect } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { networkToName } from "@/lib/utils";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { BINDER_DROP_ABI } from "@/abi";
import { NETWORK_ID } from "@/utils/common";
import { useWrite } from "@/hooks/web3";
import APIHelpers from "@/lib/apiHelper";
import { useCampaign } from "@/hooks/useCampaign";
export default function MintButton({
  campaignNetworkId,
  recipient,
  signature,
  binderContract,
}: {
  campaignNetworkId: number;
  recipient: string;
  signature: string;
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
  } = useWrite({
    networkId: campaignNetworkId,
    contractAddress: binderContract,
    abi: BINDER_DROP_ABI,
    functionName: "mintTo",
    args: [instance.orderId, recipient, signature],
  });
  const { setCurrentStepIndex } = useSteps();

  async function mint() {
    if (write) {
      // create new order
      await APIHelpers.post("/api/campaigns/1/orders", {
        body: {
          campaignId: instance.campaignId,
          collectionNetwork: networkToName(instance.nftNetworkId).toUpperCase(),
          collectionAddress: instance.contractAddress,
          selectedTokenId: instance.tokenId,
          personalNote: instance.note,
        },
      });
      await write();
      // after succuessful mint, update instance with tokenId, we currently using the tokenId of the parent NFT for simplicity sake but need to change this later
      setInstance({
        mintedTokenId: instance.tokenId,
      });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setCurrentStepIndex(3);
    }
  }, [isSuccess, setCurrentStepIndex]);

  return (
    <>
      <BinderButton
        primary={false}
        title={wrongNetwork ? "Switch network" : "Mint"}
        onClick={!wrongNetwork ? () => mint() : () => switchCorrectNetwork()}
        isLoading={isLoading}
        className="w-1/2 mx-auto mb-2"
      />
      <ErrorDisplay error={error} />
    </>
  );
}
