"use client";

import { usePrivy } from "@privy-io/react-auth";
import BinderButton from "@/app/components/BinderButton";
import LogoutButton from "./LogoutButton";
import { useWallets } from "@privy-io/react-auth";
import DeployButton from "./admin/deploy/DeployButton";
import { binderFactoryContract, binderNetworkId } from "@/utils/common";


export default function LoginButton() {
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();

  if (authenticated) {
    return (
      <div className="flex flex-col items-center gap-3">
      {
        wallets.length > 0 && (
          <DeployButton
            networkId={binderNetworkId}
            contractAddress={binderFactoryContract}
            creatorAddress={wallets[0].address}
          />
        )
      }
      <LogoutButton size="lg" withText />
      </div>
    )
  }


  return (
    <BinderButton onClick={login}>Login</BinderButton>
  );
}
