"use client";

import { useEffect } from "react";
import BinderButton from "@/app/components/BinderButton";
import { useSteps } from "@/context/StepsContext";
import { getOpenseaLink, networkToName, shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { useInstance } from "@/context/InstanceContext";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { BINDER_DROP_ABI } from "@/abi";
import { CAMPAIGN_ID, NETWORK_ID } from "@/utils/common";
import { useWrite } from "@/hooks/web3";
import APIHelpers from "@/lib/apiHelper";

export default function ReviewAndPayStep({
  nft,
}: {
  nft: {
    nftNetworkId: number;
    contractAddress: string;
    tokenId: string;
    nftUrl: string;
    name: string;
  };
}) {
  const {
    write,
    error,
    isLoading,
    data,
    switchCorrectNetwork,
    wrongNetwork,
    isSuccess,
  } = useWrite({
    networkId: NETWORK_ID,
    contractAddress: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
    abi: BINDER_DROP_ABI,
    functionName: "mintTo",
    args: [
      "0x128f606874e46e38192fF8D50331e967f99863c6",
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      "ipfs://QmX48MqNwx1EBCVwqWByLWCpunF7fvQxLG5SjieQFnNuxk/0",
      100,
    ],
  });

  const { setCurrentStepIndex } = useSteps();
  const { note } = useInstance();

  const gasFee = 0.1;
  const platformFee = 0.9;

  async function mint() {
    if (write) {
      // create new order
      const orders = await APIHelpers.post("/api/campaigns/1/orders", {
        body: {
          campaignId: CAMPAIGN_ID,
          collectionNetwork: networkToName(nft.nftNetworkId).toUpperCase(),
          collectionAddress: nft.contractAddress,
          selectedTokenId: nft.tokenId,
          personalNote: note,
        },
      });
      await write();
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setCurrentStepIndex(3);
    }
  }, [isSuccess, setCurrentStepIndex]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-4 grow">
        <h1>Review and Pay</h1>
        <div className="inline-flex bg-black p-4 rounded-md flex-col items-start gap-[8px] relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
            NFT
          </div>
          <a
            className="inline-flex items-center gap-[16px] relative flex-[0_0_auto] cursor-pointer"
            href={getOpenseaLink(
              nft.nftNetworkId!,
              nft.contractAddress,
              nft.tokenId
            )}
            target="_blank"
          >
            <Image
              width={64}
              height={64}
              className="relative w-[64px] h-[64px] object-cover"
              alt="Aayadkmi"
              src={
                nft.nftUrl || "/assets/c0302e13-7d87-4ca5-8002-d33354112ad3.png"
              }
            />
            <div className="inline-flex flex-col items-start gap-[4px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
                {`${nft.name}`}
              </div>
              <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-grey-200 text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                Token ID: {nft.tokenId}
              </div>
              <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-grey-200 text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                Contract:{" "}
                {nft.contractAddress || shortenAddress(nft.contractAddress)}
              </div>
            </div>
          </a>
          <div className="text-neutral-400 text-sm">Note for the artist</div>
          <div>{note || "No note for you sorry. I'm a busy collector."}</div>
        </div>
        <div className="inline-flex bg-black p-4 rounded-md flex-col items-start gap-[8px] relative flex-[0_0_auto]">
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Platform fee</div>

            <div>${platformFee}</div>
          </div>
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Gas fee</div>

            <div>${gasFee}</div>
          </div>
          <div className="flex flex-row justify-between w-full text-xl font-bold">
            <div>You pay</div>

            <div>${(platformFee + gasFee).toFixed(2)}</div>
          </div>
        </div>
      </div>

      <BinderButton
        primary={false}
        title={wrongNetwork ? "Switch network" : "Mint"}
        onClick={write ? () => mint() : () => switchCorrectNetwork()}
        isLoading={isLoading}
        className="w-1/2 mx-auto mb-2"
      />

      <ErrorDisplay error={error} />
    </div>
  );
}
