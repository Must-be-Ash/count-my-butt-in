"use client";
import { useState } from "react";
import { Campaign } from "@prisma/client";
import LoginButton from "@/app/components/LoginButton";
import LogoutButton from "@/app/components/LogoutButton";
import DeployButton from "@/app/components/admin/deploy/DeployButton";

import { useWallets } from "@privy-io/react-auth";
import { binderFactoryContract, binderNetworkId } from "@/utils/common";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function CreateCampaign() {
  const [config, setConfig] = useState<Partial<Campaign> | undefined>();
  const [camapginId, setCampaignId] = useState();
  const { login, authenticated, user } = useAuthentication();
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
    </div>
  );
}
