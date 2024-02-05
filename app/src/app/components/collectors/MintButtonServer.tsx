"use client";

import { useCallback, useEffect, useState } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import APIHelpers from "@/lib/apiHelper";
import { BigNumber } from "alchemy-sdk";
import { PAYMENT_WALLET } from "@/utils/common";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useTransferETH } from "@/hooks/web3";
import LoginButton from "../LoginButton";

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
  const [openTipModal, setOpenTipModal] = useState(false);
  const { setCurrentStepIndex } = useSteps();
  const { authenticated } = useAuthentication();
  const {
    isSuccess: transferETHSuccess,
    error: transferETHError,
    write,
    isLoading,
  } = useTransferETH({
    to: PAYMENT_WALLET[campaignNetworkId],
    value: instance.tipAmount,
  });
  const mint = useCallback(async () => {
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
  }, [
    binderContract,
    campaignNetworkId,
    instance.campaignId,
    instance.orderId,
    recipient,
    setCurrentStepIndex,
    setInstance,
    signature,
  ]);

  useEffect(() => {
    if (transferETHSuccess) {
      mint();
    }
  }, [transferETHSuccess, mint]);
  console.log("qwdqwd", instance.tipAmount);
  return (
    <>
      {!instance.tipAmount && (
        <BinderButton isLoading={loading} onClick={() => mint()}>
          {"Buy now"}
        </BinderButton>
      )}
      {instance.tipAmount > 0 && (
        <div className="flex flex-col items-center mt-4 gap-4 w-full">
          <div className="font-bold text-md text-center">
            We cover the gas fees but not the tips 😈. Choose method of payment
            for your tips!
          </div>
          <BinderButton className="w-full"> Paypal </BinderButton>
          {authenticated && (
            <BinderButton
              isLoading={isLoading || loading}
              onClick={() => write()}
              className="w-full"
            >
              {" "}
              Tip with Crypto{" "}
            </BinderButton>
          )}

          <LoginButton title="Crypto Wallet" className="w-full" />

          {!!error && <ErrorDisplay error={error} />}
        </div>
      )}

      <ErrorDisplay error={error} />
    </>
  );
}
