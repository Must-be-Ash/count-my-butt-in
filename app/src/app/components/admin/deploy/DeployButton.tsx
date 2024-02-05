"use client";
import { useEffect, useState } from "react";
import BinderButton from "@/app/components/BinderButton";
import APIHelpers from "@/lib/apiHelper";
import { useWrite } from "@/hooks/web3";
import { BINDER_FACTORY_ABI } from "@/abi";
import { DEFAULT_METADATA_URL } from "@/utils/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "../../Loader";
import { useAuthentication } from "@/hooks/useAuthentication";
import { networkToName } from "@/lib/utils";

export default function DeployButton({
  networkId,
  contractAddress,
  creatorAddress,
}: {
  networkId: number;
  contractAddress: string;
  creatorAddress: string;
}) {
  const { authenticatedUser } = useAuthentication();
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
      // "https://arweave.net/ckSld6yHJxWxis45HhUxOcaP23Ksym1rv1rcDrz8Z-E",
      // "https://arweave.net/M5Q3_Par8qCHfxmy54-HxHchi_-DE-FrqdFdbYemshQ",
      // "https://arweave.net/QqvTJMEs0cb3WrKZGsFtviWkUxEjk2r_IY4n4v7zhJM",
      "https://arweave.net/sXdaPFgUktBdJyWyc7ftay74xSkXCHovj_7zRh4u6K8",
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
            networkId: networkToName(networkId).toUpperCase(),
          },
        });
        const campaign = result.campaign;
        setDeployedContract(contractAddress);
        setCampaignId(campaign.campaignId);
        await APIHelpers.patch(`/api/campaigns/${campaign.campaignId}`, {
          body: {
            userId: authenticatedUser?.id,
          },
        });
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
