"use client";

import { useState } from "react";
import BinderButton from "../binderButton";
import { useSteps } from "@/context/StepsContext";
import { getOpenseaLink, shortenAddress } from "@/lib/utils";
import Image from "next/image";

export default function ReviewAndPayStep({
  nft,
}: {
  nft: {
    nftNetworkId: number;
    contractAddress: string;
    tokenId: string;
    nftUrl: string;
  };
}) {
  console.log(nft);
  const [note, setNote] = useState<string>("");
  const { setCurrentStepIndex } = useSteps();

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
                {`${"Doodle"} #${"1234"}`}
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
          <div>
            Hi Vinnie! Big fan of Letters! Been a holder since mint. Could you
            draw a letter for me and make it out to Ash please? Thanks!
          </div>
        </div>
        <div className="inline-flex bg-black p-4 rounded-md flex-col items-start gap-[8px] relative flex-[0_0_auto]">
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Platform fee</div>

            <div>$0.90</div>
          </div>
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Gas fee</div>

            <div>$0.10</div>
          </div>
          <div className="flex flex-row justify-between w-full text-xl font-bold">
            <div>You pay</div>

            <div>$1.00</div>
          </div>
        </div>
      </div>

      <BinderButton
        primary={false}
        title="Connect Wallet"
        onClick={() => setCurrentStepIndex(2)}
        className="w-1/2 mx-auto"
      />
    </div>
  );
}
