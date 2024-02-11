"use client";

import { useAuthentication } from "@/hooks/useAuthentication";
import formatWalletAddress from "@/utils/formatWalletAddress";
import DefaultPfp from "public/assets/defaults/pfp.jpg";
import Image from "next/image";
import Loader from "./Loader";
import { User } from "@prisma/client";
import { FaXTwitter } from "react-icons/fa6";
import { TbCurrencyEthereum } from "react-icons/tb";
import { FaWallet } from "react-icons/fa";
import { useCampaign } from "@/hooks/useCampaign";
import { getOpenseaCollectionLink } from "@/utils/common";
import { nameToNetwork } from "@/lib/utils";

export default function CampaignInfo({ campaignId }: { campaignId: string }) {
  const { campaign } = useCampaign(campaignId, true);
  const user = campaign?.user;
  const display = formatWalletAddress(user?.walletAddresses[0]);
  if (!user) {
    return <Loader />;
  }

  return (
    <span className="flex flex-row gap-2 items-center">
      <Image
        src={user?.imageUrl || DefaultPfp}
        alt="profile picture"
        className="rounded-full w-8 h-8"
        width={32}
        height={32}
      />
      <div className="font-sans font-bold uppercase text-sm">
        {user?.nickname || display}
      </div>
      {user?.nickname?.includes("@") && (
        <a
          href={`https://twitter.com/${user?.nickname}`}
          target="_blank"
          className="cursor-pointer"
        >
          <FaXTwitter />
        </a>
      )}
      {user?.walletAddresses[0] && (
        <a
          href={`https://etherscan.io/address/${user?.walletAddresses[0]}`}
          target="_blank"
          className="cursor-pointer"
        >
          <FaWallet />
        </a>
      )}
      {user?.twitterUsername && (
        <a
          href={`https://twitter.com/${user?.twitterUsername}`}
          target="_blank"
          className="cursor-pointer"
        >
          <img src="/assets/twitter_white.svg" className="h-4 w-4" />
        </a>
      )}
      {campaign?.binderContract && (
        <a
          href={getOpenseaCollectionLink(
            nameToNetwork(campaign.networkId),
            campaign.binderContract
          )}
          target="_blank"
          className="cursor-pointer"
        >
          <img src="/assets/opensea-logo.svg" className="h-4 w-4" />
        </a>
      )}
    </span>
  );
}
