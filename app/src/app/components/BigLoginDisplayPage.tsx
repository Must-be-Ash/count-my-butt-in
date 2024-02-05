"use client";

import BinderMainLogo from "./BinderMainLogo";
import LoginButton from "./LoginButton";
import { useAuthentication } from "@/hooks/useAuthentication";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWallets } from "@privy-io/react-auth";
import DeployButton from "./admin/deploy/DeployButton";
import { SUPPORTED_NETWORKS, binderFactoryContract } from "@/utils/common";

import { networkToName } from "@/lib/utils";
import { useState } from "react";
export default function BigLoginDisplayPage() {
  const { authenticated } = useAuthentication();
  const { wallets } = useWallets();
  const [network, setNetwork] = useState<number | undefined>(10);

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="relative flex place-items-center z-[-1]">
        <BinderMainLogo />
      </div>
      <div className="flex flex-col items-center gap-3 mb-4">
        {authenticated && wallets.length > 0 && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="mb-4 w-full p-4">
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
      </div>
      <LoginButton />
    </main>
  );
}
