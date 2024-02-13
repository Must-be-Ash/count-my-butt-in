import NFTDisplayFull from "@/app/components/NftDisplayFull";
import BinderButton from "@/app/components/BinderButton";
import { getOpenseaLink, nameToNetwork } from "@/lib/utils";
import { useInstance } from "@/context/InstanceContext";
import { useCampaign } from "@/hooks/useCampaign";
import Link from "next/link";
import Loader from "../Loader";
import { useAuthentication } from "@/hooks/useAuthentication";

export function SuccessStep() {
  const { authenticated } = useAuthentication();
  const { instance } = useInstance();
  const { campaign } = useCampaign(instance.campaignId);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="bg-white rounded-lg w-full p-4">
        <div className="flex flex-row items-center justify-center">
          <video
            src="https://arweave.net/aZBb0n-kqSh7eyNcxw4KhAyCBCcQyGO1GnWbV2e0Hcw"
            className="max-h-[400px] rounded-lg"
            autoPlay
            muted
            loop
          />
          {!campaign && (
            <div className="flex flex-col justify-center h-[252px]">
              <Loader color="black" />
            </div>
          )}
        </div>
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold text-black">Congrats!🎉🎉</h1>
          <p className="mt-2 text-gray-600">
            Your token is waiting to be signed. You can head to the gallery and
            wait for the autograph to reveal.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-row justify-center items-center mt-4 gap-6">
        {authenticated && (
          <Link href={`/collector`} className="w-full">
            <BinderButton className="w-full">Go Home</BinderButton>
          </Link>
        )}
        <Link
          href={`${window.location.origin}/campaigns/${instance.campaignId}`}
          target="_blank"
          rel="noreferrer"
          className="w-full"
        >
          <BinderButton className="w-full ">Go to gallery</BinderButton>
        </Link>
      </div>
    </div>
  );
}
