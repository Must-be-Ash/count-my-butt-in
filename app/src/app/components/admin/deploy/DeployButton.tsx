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
import SetAdminButton from "./SetAdminButton";

export default function DeployButton({
  networkId,
  contractAddress,
  creatorAddress,
}: {
  networkId: number;
  contractAddress: string;
  creatorAddress: string;
}) {
  const [deployedContract, setDeployedContract] = useState();

  const {
    write,
    error,
    isLoading,
    data,
    switchCorrectNetwork,
    wrongNetwork,
    isSuccess,
    parsed,
  } = useWrite({
    networkId,
    contractAddress,
    abi: BINDER_FACTORY_ABI,
    functionName: "createBinderDrop",
    args: [
      creatorAddress,
      "https://arweave.net/w7Z7IWypheVcC1N5EtIxauotwCNNyocz57NA07kEbjM",
    ],
  });

  useEffect(() => {
    const run = async () => {
      if (parsed) {
        const contractAddress = parsed.args.clone;
        setDeployedContract(contractAddress);
      }
    };

    run();
  }, [parsed, isSuccess]);

  return (
    <>
      {!deployedContract && (
        <BinderButton
          primary={false}
          textColor="text-black"
          title="Deploy Campaign Contract"
          onClick={
            !wrongNetwork && write
              ? () => write()
              : () => switchCorrectNetwork()
          }
        />
      )}
      {deployedContract && (
        <SetAdminButton
          networkId={binderNetworkId}
          contractAddress={deployedContract}
        />
      )}
      {deployedContract && (
        <a
          href={getContractEtherscanLink(binderNetworkId, deployedContract)}
          target="_blank"
        >{`Deployed Contract Address: ${deployedContract}`}</a>
      )}
    </>
  );
}
