"use client";

import { useEffect } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { getOpenseaLink, networkToName, shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { BINDER_DROP_ABI } from "@/abi";
import {
  BINDER_CONTRACT_ADDRESS,
  CAMPAIGN_ID,
  NETWORK_ID,
} from "@/utils/common";
import { useWrite } from "@/hooks/web3";
import APIHelpers from "@/lib/apiHelper";
import { formatBytes32String } from "@ethersproject/strings";
export default function MintButton({
  recipient,
  signature,
  nft,
}: {
  recipient: string;
  signature: string;
  nft: {
    nftNetworkId: number;
    contractAddress: string;
    tokenId: string;
    nftUrl: string;
    name: string;
  };
}) {
  console.log(recipient, nft.tokenId, signature);
  const {
    write,
    error,
    isLoading,
    data,
    switchCorrectNetwork,
    wrongNetwork,
    isSuccess,
  } = useWrite({
    networkId: NETWORK_ID,
    contractAddress: BINDER_CONTRACT_ADDRESS,
    abi: BINDER_DROP_ABI,
    functionName: "mintTo",
    args: [recipient, Number(nft.tokenId), signature],
  });
  console.log("wwww", error);
  const { setCurrentStepIndex } = useSteps();
  const { note } = useInstance();

  async function mint() {
    if (write) {
      // create new order
      await APIHelpers.post("/api/campaigns/1/orders", {
        body: {
          campaignId: CAMPAIGN_ID,
          collectionNetwork: networkToName(nft.nftNetworkId).toUpperCase(),
          collectionAddress: nft.contractAddress,
          selectedTokenId: nft.tokenId,
          personalNote: note,
        },
      });
      await write();
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
        onClick={write ? () => mint() : () => switchCorrectNetwork()}
        isLoading={isLoading}
        className="w-1/2 mx-auto mb-2"
      />
      <ErrorDisplay error={error} />
    </>
  );
}
