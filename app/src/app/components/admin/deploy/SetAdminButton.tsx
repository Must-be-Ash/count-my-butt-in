"use client";
import { useEffect, useState } from "react";
import { Campaign, Network } from "@prisma/client";
import BinderButton from "@/app/components/BinderButton";
import APIHelpers from "@/lib/apiHelper";
import LoginButton from "@/app/components/LoginButton";
import { useWrite } from "@/hooks/web3";
import { BINDER_DROP_ABI, BINDER_FACTORY_ABI } from "@/abi";
import { usePrivy } from "@privy-io/react-auth";
import LogoutButton from "@/app/components/LogoutButton";
import { getContractEtherscanLink } from "@/utils/common";
import { binderNetworkId } from "@/app/admin/deploy/page";

export default function SetAdminButton({
  networkId,
  contractAddress,
}: {
  networkId: number;
  contractAddress: string;
}) {
  const { write, wrongNetwork, switchCorrectNetwork } = useWrite({
    networkId,
    contractAddress,
    abi: BINDER_DROP_ABI,
    functionName: "addNewAdmin",
    args: ["0xCD56df7B4705A99eBEBE2216e350638a1582bEC4"],
  });

  return (
    <>
      <BinderButton
        primary={false}
        textColor="text-black"
        title="Set Admin"
        onClick={
          !wrongNetwork && write ? () => write() : () => switchCorrectNetwork()
        }
      />
    </>
  );
}
