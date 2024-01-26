"use client";

import { useEffect, useState } from "react";
import {
  getOpenseaLink,
  nameToNetwork,
  networkToName,
  shortenAddress,
} from "@/lib/utils";
import Image from "next/image";
import { useInstance } from "@/context/InstanceContext";
import APIHelpers from "@/lib/apiHelper";
import MintButton from "./MintButton";
import Loader from "../Loader";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCampaign } from "@/hooks/useCampaign";
import { getContractEtherscanLink } from "@/utils/common";

export default function ReviewAndPayStep() {
  const { instance, setInstance } = useInstance();
  const [signature, setSignature] = useState<string>();
  const [recipient, setRecipient] = useState<string>();
  const { campaign } = useCampaign(instance.campaignId);

  const gasFee = 0.1;
  const platformFee = 0.9;

  useEffect(() => {
    const run = async () => {
      // create new order and save to BE

      const result = await APIHelpers.post("/api/campaigns/1/orders", {
        body: {
          campaignId: instance.campaignId,
          collectionNetwork: networkToName(instance.nftNetworkId).toUpperCase(),
          collectionAddress: instance.contractAddress,
          selectedTokenId: instance.tokenId,
          personalNote: instance.note,
        },
      });

      setInstance({
        ...instance,
        orderId: result.order.orderId,
      });
    };

    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      const { signature, recipient } = await APIHelpers.post(
        `/api/campaign/${instance.campaignId}/sign`,
        {
          body: {
            tokenId: instance.tokenId,
            contractAddress: instance.contractAddress,
            networkId: instance.nftNetworkId,
          },
        }
      );
      setSignature(signature.signature);
      setRecipient(recipient);
    };

    run();
  }, [instance]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex flex-col gap-2 mb-5">
        <h1>Review and Pay</h1>
        <div className="bg-black p-4 rounded-md flex flex-col items-start gap-2 w-full">
          <a
            className="items-center gap-[16px] relative cursor-pointer w-full flex flex-row"
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
              className="relative w-[64px] h-[64px] object-cover rounded-md"
              alt="Aayadkmi"
              src={
                instance.nftUrl ||
                "/assets/c0302e13-7d87-4ca5-8002-d33354112ad3.png"
              }
            />
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="mt-[-1.00px] font-semibold text-[16px]">
                {`${instance.name}`}
              </div>
              <div className="text-grey-200 text-[14px]">
                Token ID: {instance.tokenId}
              </div>
              <a
                href={getContractEtherscanLink(
                  instance.nftNetworkId,
                  instance.contractAddress
                )}
                target="_blank"
                className="text-grey-200 text-[14px]"
              >
                Contract: {shortenAddress(instance.contractAddress)}
              </a>
            </div>
          </a>
        </div>
        {instance.note && (
          <div className="bg-black p-4 rounded-md">
            <div className="text-neutral-400 text-sm">Note for the artist</div>
            <div>{instance.note}</div>
          </div>
        )}
        <div className="inline-flex bg-black p-4 rounded-md flex-col items-start gap-[8px] relative flex-[0_0_auto]">
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Platform fee</div>

            <div>${platformFee}</div>
          </div>
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Gas fee</div>

            <div>${gasFee}</div>
          </div>
          {instance.tipAmount > 0 && (
            <div className="flex flex-row justify-between w-full text-neutral-400">
              <div>tip</div>

              <div>${instance.tipAmount}</div>
            </div>
          )}
          <div className="flex flex-row justify-between w-full text-xl font-bold">
            <div>You pay</div>

            <div>${(platformFee + gasFee).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {!!recipient &&
      !!signature &&
      !!campaign?.binderContract &&
      !!campaign.networkId &&
      !!instance.orderId ? (
        <MintButton
          campaignNetworkId={nameToNetwork(campaign.networkId)}
          signature={signature}
          recipient={recipient}
          binderContract={campaign.binderContract}
        />
      ) : (
        <div className="flex flex-row justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
}
