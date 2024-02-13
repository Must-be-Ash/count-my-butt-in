"use client";
import { useState } from "react";
import BinderButton from "@/app/components/BinderButton";
import APIHelpers from "@/lib/apiHelper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "../../Loader";
import { useAuthentication } from "@/hooks/useAuthentication";
import { networkToName } from "@/lib/utils";
import { BINDER_DROP_TOKEN } from "@/utils/common";

export default function DeployButton({ networkId }: { networkId: number }) {
  const { authenticatedUser } = useAuthentication();
  const [campaignId, setCampaignId] = useState<string>();
  const router = useRouter();
  const [loading, setIsLoading] = useState<boolean>(false);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <BinderButton onClick={() => createCampaign()} >
        Start a Campaign
      </BinderButton>
      {campaignId && (
        <div className="cursor-pointer">
          <Link
            href={`/dashboard/${campaignId}/orders`}
            target="_blank"
            className="underline"
          >
            Click here if you are not redirected automatically.
          </Link>
        </div>
      )}
    </>
  );
}
