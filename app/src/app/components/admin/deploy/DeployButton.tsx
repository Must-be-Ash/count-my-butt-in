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
import { binderNetworkId, getContractEtherscanLink } from "@/utils/common";
import SetAdminButton from "./SetAdminButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "../../Loader";

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
  const [campaignId, setCampaignId] = useState<string>();
  const router = useRouter();
  const [loading, setIsLoading] = useState<boolean>(false);

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
      "https://arweave.net/ckSld6yHJxWxis45HhUxOcaP23Ksym1rv1rcDrz8Z-E",
      0,
      5,
    ],
  });
  useEffect(() => {
    if (campaignId) {
      router.push(`/dashboard/${campaignId}/orders`);
    }
  }, [campaignId, router, deployedContract, parsed]);
  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      if (parsed && (!campaignId || !contractAddress)) {
        const contractAddress = parsed.args.clone;
        const result = await APIHelpers.post("/api/campaigns", {
          body: {
            binderContract: parsed?.args.clone,
            networkId: "SEPOLIA",
          },
        });
        const campaign = result.campaign;
        setDeployedContract(contractAddress);
        setCampaignId(campaign.campaignId);
      }
      setIsLoading(false);
    };
    run();
  }, [parsed, isSuccess, deployedContract, campaignId, contractAddress]);

  if (isLoading || loading) {
    return <Loader />;
  }

  return (
    <>
      {!deployedContract && (
        <BinderButton
          onClick={
            !wrongNetwork && write
              ? () => write()
              : () => switchCorrectNetwork()
          }
        >
          Start a Campaign
        </BinderButton>
      )}
      {deployedContract && campaignId && (
        <div className="cursor-pointer">
          <Link
            href={`/dashboard/${campaignId}/orders`}
            target="_blank"
            className="underline"
          >
            Click here if you are not redirected automatically.
          </Link>
        </div>
      )}
    </>
  );
}
