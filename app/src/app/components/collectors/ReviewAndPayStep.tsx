"use client";

import { useEffect, useState } from "react";
import { getOpenseaLink, shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { useInstance } from "@/context/InstanceContext";
import APIHelpers from "@/lib/apiHelper";
import MintButton from "./MintButton";
import Loader from "../Loader";
import { TokenboundClient } from "@tokenbound/sdk";

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
  const { note } = useInstance();
  const [recipient, setRecipient] = useState<string>();
  const [signature, setSignature] = useState<string>();

  const gasFee = 0.1;
  const platformFee = 0.9;

  useEffect(() => {
    const run = async () => {
      const tokenboundClient = new TokenboundClient({
        chainId: nft.nftNetworkId,
      });
      setRecipient(
        await tokenboundClient.getAccount({
          tokenContract: nft.contractAddress as `0x${string}`,
          tokenId: nft.tokenId,
        })
      );
    };

    run();
  }, [nft]);

  useEffect(() => {
    const run = async () => {
      if (recipient) {
        const signature = await APIHelpers.post("/api/sign", {
          body: {
            recipient,
            tokenId: nft.tokenId,
          },
        });
        setSignature(signature.signature);
      }
    };

    run();
  }, [recipient, nft]);

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

      {!!recipient && !!signature ? (
        <MintButton recipient={recipient} signature={signature} nft={nft} />
      ) : (
        <Loader />
      )}
    </div>
  );
}
