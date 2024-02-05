"use client";

import { useEffect, useState } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { networkToName } from "@/lib/utils";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { BINDER_DROP_ABI } from "@/abi";
import { useWrite } from "@/hooks/web3";
import APIHelpers from "@/lib/apiHelper";
import { useCampaign } from "@/hooks/useCampaign";
import { BigNumber } from "alchemy-sdk";
export default function MintButtonServer({
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
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { setCurrentStepIndex } = useSteps();

  async function mint() {
    if (!instance.orderId) {
      setError("No orderId found");
      return;
    }

    // Mint on server
    try {
      setLoading(true);
      const { tokenId } = await APIHelpers.post("/api/mint", {
        body: {
          campaignId: instance.campaignId,
          orderId: instance.orderId,
          networkId: campaignNetworkId,
          recipient,
          signature,
        },
      });
      setInstance({
        mintedTokenId: (tokenId as BigNumber).toString(), // tokenId will be a BigNumber
      });

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
      setCurrentStepIndex(4);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BinderButton isLoading={loading} onClick={() => mint()}>
        {"Buy now"}
      </BinderButton>
      <ErrorDisplay error={error} />
    </>
  );
}
