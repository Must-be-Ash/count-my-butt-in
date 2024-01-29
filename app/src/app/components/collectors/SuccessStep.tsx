import NFTDisplayFull from "@/app/components/NftDisplayFull";
import BinderButton from "@/app/components/BinderButton";
import { getOpenseaLink, nameToNetwork } from "@/lib/utils";
import { useInstance } from "@/context/InstanceContext";
import { useCampaign } from "@/hooks/useCampaign";
import Link from "next/link";
import Loader from "../Loader";

export function SuccessStep() {
  const { instance } = useInstance();
  const { campaign } = useCampaign(instance.campaignId);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="bg-white rounded-lg w-full p-4">
        <div className="flex flex-row items-center justify-center">
          {campaign && (
            <NFTDisplayFull
              networkId={nameToNetwork(campaign.networkId)}
              tokenId={instance.mintedTokenId}
              contractAddress={campaign.binderContract!}
            />
          )}
          {!campaign && (
            <div className="flex flex-col justify-center h-[252px]">
              <Loader color="black" />
            </div>
          )}
        </div>
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold">Congrats!</h1>
          <p className="mt-2 text-gray-600">
            Your token is waiting to be signed. You can head to your Binder
            profile and wait for the autograph to reveal.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-row justify-center items-center mt-4 gap-6">
        <Link href={`/collector`} className="w-full">
          <BinderButton className="w-full">Go Home</BinderButton>
        </Link>
        <Link
          href={`/asset/ethereum/${instance.contractAddress}/${instance.tokenId}`}
          className="w-full"
        >
          <BinderButton className="w-full ">See NFT</BinderButton>
        </Link>
      </div>
    </div>
  );
}
