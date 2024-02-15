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
    <main className="flex flex-col items-center justify-between">
      <div className="relative flex place-items-center z-[-1]">
        <BinderMainLogo />
      </div>
      {!authenticated && <LoginButton title={`Start Signing ✍️`} />}
      <a
        className="text-xs mt-4 cursor-pointer"
        href="https://binder.studio/"
        target="_blank"
        rel="noreferrer"
      >
        built by Binder{" "}
        <span className="font-light italic font-title">Studio</span>
      </a>
      {loading && <Loader />}
      {!loading && campaignId && (
        <Link
          href={`/dashboard/${campaignId}/orders`}
          className="py-8 underline"
        >
          Click here if you&apos;re not redirected automatically.
        </Link>
      )}
    </main>
  );
}
