"use client";

import { useEffect, useState } from "react";
import { getOpenseaLink, networkToName, shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { useInstance } from "@/context/InstanceContext";
import APIHelpers from "@/lib/apiHelper";
import MintButton from "./MintButton";
import Loader from "../Loader";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCampaign } from "@/hooks/useCampaign";

export default function ReviewAndPayStep() {
  const { instance, setInstance } = useInstance();
  const [recipient, setRecipient] = useState<string>();
  const [signature, setSignature] = useState<string>();
  const { campaign } = useCampaign(instance.campaignId);

  const gasFee = 0.1;
  const platformFee = 0.9;

  useEffect(() => {
    const run = async () => {
      const tokenboundClient = new TokenboundClient({
        chainId: instance.nftNetworkId,
      });
      setRecipient(
        await tokenboundClient.getAccount({
          tokenContract: instance.contractAddress as `0x${string}`,
          tokenId: instance.tokenId,
        })
      );
      // create new order and save to BE if not yet created
      if (!instance.orderId) {
        const result = await APIHelpers.post("/api/campaigns/1/orders", {
          body: {
            campaignId: instance.campaignId,
            collectionNetwork: networkToName(
              instance.nftNetworkId
            ).toUpperCase(),
            collectionAddress: instance.contractAddress,
            selectedTokenId: instance.tokenId,
            personalNote: instance.note,
          },
        });
        setInstance({
          ...instance,
          orderId: result.order.orderId,
        });
      }
    };

    run();
  }, [instance, setInstance]);

  useEffect(() => {
    const run = async () => {
      if (recipient) {
        const signature = await APIHelpers.post("/api/sign", {
          body: {
            recipient,
            tokenId: instance.tokenId,
          },
        });
        setSignature(signature.signature);
      }
    };

    run();
  }, [recipient, instance]);

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
              instance.nftNetworkId!,
              instance.contractAddress,
              instance.tokenId
            )}
            target="_blank"
          >
            <Image
              width={64}
              height={64}
              className="relative w-[64px] h-[64px] object-cover"
              alt="Aayadkmi"
              src={
                instance.nftUrl ||
                "/assets/c0302e13-7d87-4ca5-8002-d33354112ad3.png"
              }
            />
            <div className="inline-flex flex-col items-start gap-[4px] relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-white text-[16px] tracking-[0] leading-[24px] whitespace-nowrap">
                {`${instance.name}`}
              </div>
              <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-grey-200 text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                Token ID: {instance.tokenId}
              </div>
              <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-grey-200 text-[14px] tracking-[0] leading-[20px] whitespace-nowrap">
                Contract:{" "}
                {instance.contractAddress ||
                  shortenAddress(instance.contractAddress)}
              </div>
            </div>
          </a>
          <div className="text-neutral-400 text-sm">Note for the artist</div>
          <div>
            {instance.note || "No note for you sorry. I'm a busy collector."}
          </div>
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

      {!!recipient &&
      !!signature &&
      !!campaign?.binderContract &&
      !!instance.orderId ? (
        <MintButton
          recipient={recipient}
          signature={signature}
          binderContract={campaign.binderContract}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
}
