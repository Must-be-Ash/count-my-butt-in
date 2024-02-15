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
import Loader from "./Loader";
import Link from "next/link";

export default function BigLoginDisplayPage({
  networkId,
}: {
  networkId: number;
}) {
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
        userId: authenticatedUser?.id,
      },
    });
    const campaignId = result.campaign.campaignId;
    setCampaignId(campaignId);
    setIsLoading(false);
  };

  // if user found & no last campaign found
  // fetch their last campaign and set in state
  useEffect(() => {
    if (
      authenticated &&
      isEmpty(authenticatedUser?.campaign) &&
      isNil(campaignId) &&
      authenticatedUser &&
      authenticatedUser.id
    ) {
      createCampaign();
    }

    if (
      authenticated &&
      !isEmpty(authenticatedUser?.campaign) &&
      authenticatedUser
    ) {
      setCampaignId(authenticatedUser?.campaign.campaignId);
    }
  }, [authenticatedUser, authenticated, campaignId]);

  // if campaign id set, redirect to the dashboard
  useEffect(() => {
    setIsLoading(true);
    if (campaignId) {
      router.push(`/dashboard/${campaignId}/orders`);
    }
    setIsLoading(false);
  }, [campaignId]);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
      <div className="flex flex-col gap-3">
      <div className="relative flex place-items-center place-self-center">
          <BinderMainLogo />
      </div>
      {!authenticated && <LoginButton title={`Start Signing ✍️`} />}
      <div className="text-xs mt-4 font-extralight z-10 place-self-center">built by&nbsp;
        <span className="text-sm font-bold">
          Binder <span className="font-light italic font-title text-[15px]">Studio</span>
        </span>
      </div>
      {loading && <Loader className="place-self-center" />}
      {loading && campaignId && (
        <Link
          href={`/dashboard/${campaignId}/orders`}
          className="py-8 underline"
        >
          Click here if you&apos;re not redirected automatically.
        </Link>
      )}
      </div>
    </main>
  );
}
