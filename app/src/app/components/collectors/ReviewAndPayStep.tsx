"use client";

import { useEffect, useState } from "react";
import {
  ethToUsd,
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
import { defaultNote, getContractEtherscanLink } from "@/utils/common";
import { useAuthentication } from "@/hooks/useAuthentication";
import LoginButton from "@/app/components/LoginButton";

export default function ReviewAndPayStep() {
  const { user, authenticatedUser, authenticated } = useAuthentication();
  const { instance, setInstance } = useInstance();
  const [signature, setSignature] = useState<string>();
  const [recipient, setRecipient] = useState<string>();
  const { campaign } = useCampaign(instance.campaignId);
  const [tipAmountInUSD, setTipAmountInUSd] = useState(0);

  const gasFee = 0.1;
  const platformFee = 0.9;

  useEffect(() => {
    const run = async () => {
      if (instance.tipAmount && Number(instance.tipAmount) > 0) {
        const usd = await ethToUsd(Number(instance.tipAmount));
        setTipAmountInUSd(usd);
      }
    };

    run();
  }, [instance.tipAmount]);

  useEffect(() => {
    const run = async () => {
      if (authenticatedUser) {
        // create new order and save to BE
        const result = await APIHelpers.post(
          `/api/campaigns/${instance.campaignId}/orders`,
          {
            body: {
              campaignId: instance.campaignId,
              collectionNetwork: networkToName(
                instance.nftNetworkId
              ).toUpperCase(),
              collectionAddress: instance.contractAddress,
              selectedTokenId: instance.tokenId,
              personalNote: instance.note,
              userId: authenticatedUser?.id,
              privyUserId: user?.id, // user here is privy user
            },
          }
        );
        // update userId and priviUserId, for some reason, these cannot be updated upon creation
        await APIHelpers.patch(
          `/api/campaigns/${instance.campaignId}/orders/${result.order.orderId}`,
          {
            body: {
              userId: authenticatedUser?.id,
              privyUserId: user?.id, // user here is privy user
            },
          }
        );

        setInstance({
          ...instance,
          orderId: result.order.orderId,
        });
      }
    };

    run();
  }, [authenticatedUser]);

  useEffect(() => {
    const run = async () => {
      const { signature, recipient } = await APIHelpers.post(
        `/api/campaigns/${instance.campaignId}/sign`,
        {
          body: {
            tokenId: instance.tokenId,
            contractAddress: instance.contractAddress,
            networkId: instance.nftNetworkId,
          },
        }
      );

      setSignature(signature);
      setRecipient(recipient);
    };

    run();
  }, [instance]);

  console.log(
    authenticated &&
    !!recipient &&
    !!signature &&
    !!campaign?.binderContract &&
    !!campaign.networkId &&
    !!instance.orderId
  )

  console.log({
    authenticated,
      recipient,
      signature,
      campaign,
      instance,
  })

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex flex-col gap-2">
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
            <div>{instance.note || defaultNote}</div>
          </div>
        )}
        <div className="inline-flex bg-black p-4 rounded-md flex-col items-start gap-[8px] relative flex-[0_0_auto]">
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Platform fee</div>

            <div className="line-through">${platformFee}</div>
          </div>
          <div className="flex flex-row justify-between w-full text-neutral-400">
            <div>Gas fee</div>

            <div>${gasFee}</div>
          </div>
          {tipAmountInUSD > 0 && (
            <div className="flex flex-row justify-between w-full text-neutral-400">
              <div>tip</div>

              <div>${tipAmountInUSD.toFixed(2)}</div>
            </div>
          )}
          <div className="flex flex-row justify-between w-full text-xl font-bold">
            <div>You pay</div>

            <div>${(gasFee + tipAmountInUSD).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {!authenticated && <LoginButton />}

      {authenticated &&
      !!recipient &&
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
      ) : authenticated ? (
        <div className="flex flex-row justify-center">
          <Loader />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
