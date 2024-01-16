"use client";
import { useState } from "react";
import { Campaign } from "@prisma/client";
import LoginButton from "@/app/components/LoginButton";
import { usePrivy } from "@privy-io/react-auth";
import LogoutButton from "@/app/components/LogoutButton";
import DeployButton from "@/app/components/admin/deploy/DeployButton";

import { useWallets } from "@privy-io/react-auth";
import { binderFactoryContract, binderNetworkId } from "@/utils/common";
import BinderButton from "@/app/components/BinderButton";
import Link from "next/link";

export default function CreateCampaign() {
  const [config, setConfig] = useState<Partial<Campaign> | undefined>();
  const [camapginId, setCampaignId] = useState();
  const { login, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  return (
    <div className="flex flex-col gap-4 max-w-sm p-10">
      <LogoutButton size="lg" />
      {authenticated && wallets.length > 0 && (
        <DeployButton
          networkId={binderNetworkId}
          contractAddress={binderFactoryContract}
          creatorAddress={wallets[0].address}
        />
      )}
      {!authenticated && <LoginButton />}
      <Link className="mt-4" href="/admin">
        <BinderButton title={"Create Campaign"} />
      </Link>
    </div>
  );
}
