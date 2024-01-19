import NFTDisplayFull from "@/app/components/NftDisplayFull";
import BinderButton from "@/app/components/BinderButton";
import { getOpenseaLink, nameToNetwork } from "@/lib/utils";
import { useInstance } from "@/context/InstanceContext";
import NFTDisplay from "../NftDisplay";
import { useCampaign } from "@/hooks/useCampaign";
import Link from "next/link";

export function SuccessStep() {
  const { instance } = useInstance();
  const { campaign } = useCampaign(instance.campaignId);
  return (
    <div className="bg-white p-4 rounded-lg max-w-sm mx-auto w-full">
      <div className="flex flex-row items-center justify-center">
        {campaign && (
          <NFTDisplayFull
            networkId={nameToNetwork(campaign.networkId)}
            tokenId={instance.mintedTokenId}
            contractAddress={campaign.binderContract!}
          />
        )}
      </div>

      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold">Congrats!</h1>
        <p className="mt-2 text-gray-600">
          Your token is waiting to be signed. You can head to your Binder
          profile and wait for the autograph to reveal or you can let us notify
          you via email.
        </p>
      </div>
      <div className="mt-6 space-y-4 w-full">
        <div className="w-full mx-auto">
          <Link
            href={`/asset/sepolia/${campaign?.binderContract}/${instance.tokenId}`}
          >
            <BinderButton
              primary={true}
              onClick={() => {}}
              title="See NFT"
              textColor="text-white"
              className="mx-auto text-center w-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
