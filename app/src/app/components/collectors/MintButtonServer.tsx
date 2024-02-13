"use client";

import { useEffect, useState } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import APIHelpers from "@/lib/apiHelper";
import { PAYMENT_WALLET } from "@/utils/common";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useTransferETH } from "@/hooks/web3";
import LoginButton from "../LoginButton";
import { NetworkStatus } from "@prisma/client";

export default function MintButtonServer({
  campaignNetworkId,
}: {
  campaignNetworkId: number;
}) {
  const { instance } = useInstance();
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

  async function submitOrder() {
    if (!instance.orderId) {
      setError("No orderId found");
      return;
    }

    try {
      setLoading(true);
      // update order status to pending
      await APIHelpers.patch(
        `/api/campaigns/${instance.campaignId}/orders/${instance.orderId}`,
        {
          body: {
            status: NetworkStatus.PENDING,
          },
        }
      );
      setCurrentStepIndex(4);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (transferETHSuccess) {
      submitOrder();
    }
  }, [transferETHSuccess, submitOrder]);
  return (
    <>
      {!instance.tipAmount && (
        <BinderButton isLoading={loading} onClick={() => submitOrder()}>
          {"Get it now"}
        </BinderButton>
      )}
      {instance.tipAmount > 0 && (
        <div className="flex flex-col items-center mt-4 gap-4 w-full">
          <div className="font-bold text-md text-center">
            We cover the gas fees but not the tips 😈. Choose method of payment
            for your tips!
          </div>
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
