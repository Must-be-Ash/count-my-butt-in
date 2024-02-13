"use client";

import BinderMainLogo from "./BinderMainLogo";
import LoginButton from "./LoginButton";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useEffect, useState } from "react";
import APIHelpers from "@/lib/apiHelper";
import { useRouter } from "next/navigation";
import { BINDER_DROP_TOKEN } from "@/utils/common";
import { networkToName } from "@/lib/utils";
import { isEmpty, isNil } from "lodash";

export default function BigLoginDisplayPage({ networkId }: { networkId: number }) {
  const { authenticated, authenticatedUser } = useAuthentication();
  const [campaignId, setCampaignId] = useState<string | undefined>(undefined);
  const [loading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const createCampaign = async () => {
    setIsLoading(true);
    const result = await APIHelpers.post("/api/campaigns", {
      body: {
        binderContract: BINDER_DROP_TOKEN,
        networkId: networkToName(networkId).toUpperCase(),
        userId: authenticatedUser?.id
      },
    });
    const campaignId = result.campaign.campaignId;
    setCampaignId(campaignId);
    setIsLoading(false);
  }

  // if user found & no last campaign found
  // fetch their last campaign and set in state
  useEffect(() => {
    if (
      authenticated
      && isEmpty(authenticatedUser?.campaign)
      && isNil(campaignId)
      && authenticatedUser
      && authenticatedUser.id
    ) {
      createCampaign();
    }

    if (
      authenticated
      && !isEmpty(authenticatedUser?.campaign)
      && authenticatedUser
    ) {
      setCampaignId(authenticatedUser?.campaign.campaignId);
    }

  }, [authenticatedUser, authenticated, campaignId])

  // if campaign id set, redirect to the dashboard
  useEffect(() => {
    if(campaignId) {
      router.push(`/dashboard/${campaignId}/orders`);
    }
  }, [campaignId])

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="relative flex place-items-center z-[-1]">
        <BinderMainLogo />
      </div>
      <LoginButton />
    </main>
  );
}
