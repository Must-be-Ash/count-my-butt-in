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
import { BigNumber } from "alchemy-sdk";
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
    transactionError,
    switchCorrectNetwork,
    wrongNetwork,
    isSuccess,
    parsed,
  } = useWrite({
    networkId: campaignNetworkId,
    contractAddress: binderContract,
    abi: BINDER_DROP_ABI,
    functionName: "mintTo",
    args: [instance.orderId, recipient, signature],
    tipAmount: instance.tipAmount,
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
    }
  }

  useEffect(() => {
    if (isSuccess || parsed) {
      // after succuessful mint, update instance with tokenId
      if (parsed?.args?.tokenId) {
        const tokenId = parsed?.args?.tokenId;
        setInstance({
          mintedTokenId: (tokenId as BigNumber).toString(), // tokenId will be a BigNumber
        });
      }
      // trigger scanner
      APIHelpers.post("/api/scan", {
        body: {
          contractAddress: binderContract,
          networkId: campaignNetworkId,
        } as any,
      }).catch((e) => {
        console.log(`Error scanning:`);
        console.log(e);
      });
      setCurrentStepIndex(3);
      // Sometime Sepolia can throw unexplained error, trigger our scanner anyway in this case
    } else if (transactionError) {
      setTimeout(() => {
        APIHelpers.post("/api/scan", {
          body: {
            contractAddress: binderContract,
            networkId: campaignNetworkId,
          } as any,
        }).catch((e) => {
          console.log(`Error scanning:`);
          console.log(e);
        });
      }, 2000);
    }
  }, [
    binderContract,
    campaignNetworkId,
    isSuccess,
    parsed,
    setCurrentStepIndex,
    setInstance,
    transactionError,
  ]);

  return (
    <>
      <BinderButton
        onClick={!wrongNetwork ? () => mint() : () => switchCorrectNetwork()}
        isLoading={isLoading}
      >
        {wrongNetwork ? "Switch network" : "Mint"}
      </BinderButton>
      <ErrorDisplay error={error} />
    </>
  );
}
