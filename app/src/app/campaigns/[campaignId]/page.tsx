"use client";

import Main from "@/app/layouts/Main";
import { AuthenticatedPage } from "@/app/components/page/AuthenticatedPage";
import CampaignList from "@/app/components/campaign/CampaignList";
import { useAuthentication } from "@/hooks/useAuthentication";
import Loader from "@/app/components/Loader";
import UserInfo from "@/app/components/UserInfo";
import { useCampaign } from "@/hooks/useCampaign";
import CampaignInfo from "@/app/components/CampaignInfo";
import { Credenza, CredenzaContent } from "@/components/ui/credenza";
import { useState } from "react";
import SignatureVisualization from "@/app/components/campaign/SignatureVisualization";
import {
  CampaignSelectedOrderProvider,
  useCampaignSelectedOrder,
} from "@/context/campaignSelectedOrderContext";
import { getOpenseaLink } from "@/utils/common";
import { nameToNetwork } from "@/lib/utils";

export default function Campaign({
  params,
}: {
  params: { campaignId: string };
}) {
  const { order, setOrder } = useCampaignSelectedOrder();
  const { campaign } = useCampaign(params.campaignId, true);
  return (
    <main className="flex flex-col sm:max-w-[1024px] sm:mx-auto w-full h-screen p-3">
      {campaign?.user && <CampaignInfo campaignId={params.campaignId} />}

      <div className="flex-1 flex flex-col items-center w-full mt-8">
        {" "}
        <CampaignList campaignId={params.campaignId} />
      </div>
      {order && (
        <Credenza
          open={true}
          onOpenChange={(open: boolean) => !open && setOrder(undefined)}
        >
          <CredenzaContent className="dark:bg-transparent dark:border-0 flex flex-col">
            <a
              href={getOpenseaLink(
                nameToNetwork(order.mintedNetworkId),
                order.mintedContractAddress,
                order.mintedTokenId
              )}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/opensea-logo.svg"
                alt=""
                className="h-6 w-6 ml-2 text-center"
              />
            </a>
            <SignatureVisualization
              savedCanvasData={order.autographData}
              backgroundImage={order.image}
            />
          </CredenzaContent>
        </Credenza>
      )}
    </main>
  );
}
