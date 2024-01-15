"use client";
import { useEffect, useState } from "react";
import { Campaign, Network } from "@prisma/client";
import BinderButton from "@/app/components/BinderButton";
import APIHelpers from "@/lib/apiHelper";
import LoginButton from "@/app/components/LoginButton";
import { useWrite } from "@/hooks/web3";
import { BINDER_FACTORY_ABI } from "@/abi";
import { usePrivy } from "@privy-io/react-auth";
import LogoutButton from "@/app/components/LogoutButton";
import DeployButton from "@/app/components/admin/deploy/DeployButton";

import { useWallets } from "@privy-io/react-auth";

export const binderNetworkId = 11155111;
const binderFactoryContract = "0x92b1Bc9dD6ccF1F1473fCE71C6545e63773C3bE5";

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
    </div>
  );
}
