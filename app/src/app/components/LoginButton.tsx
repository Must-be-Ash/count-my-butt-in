"use client";

import BinderButton from "@/app/components/BinderButton";
import LogoutButton from "./LogoutButton";
import { useWallets } from "@privy-io/react-auth";
import DeployButton from "./admin/deploy/DeployButton";
import { SUPPORTED_NETWORKS, binderFactoryContract } from "@/utils/common";
import { useAuthentication } from "@/hooks/useAuthentication";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { networkToName } from "@/lib/utils";
import { useState } from "react";

export default function LoginButton() {
  const { login, authenticated } = useAuthentication();
  const { wallets } = useWallets();
  const [network, setNetwork] = useState<number | undefined>(10);

  if (authenticated) {
    return (
      <div className="flex flex-col items-center gap-3">
        {wallets.length > 0 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="mb-4 w-full">
                <Button variant="outline" size="icon">
                  <span>
                    {network ? networkToName(network) : "Choose Network"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {SUPPORTED_NETWORKS.map((network) => (
                  <div key={network}>
                    <DropdownMenuItem onClick={() => setNetwork(network)}>
                      {networkToName(network)}
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {network && (
              <DeployButton
                networkId={network}
                contractAddress={binderFactoryContract[network as number]}
                creatorAddress={wallets[0].address}
              />
            )}
          </>
        )}
        <LogoutButton size="lg" withText />
      </div>
    );
  }

  return <BinderButton onClick={login}>Login</BinderButton>;
}
