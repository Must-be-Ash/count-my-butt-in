"use client";
import { useState } from "react";
import { Campaign, Network } from "@prisma/client";
import BinderButton from "@/app/components/BinderButton";
import APIHelpers from "@/lib/apiHelper";
export default function CreateCampaign() {
  const [config, setConfig] = useState<Partial<Campaign> | undefined>();
  const [camapginId, setCampaignId] = useState();

  return (
    <div className="flex flex-col gap-4 max-w-sm p-10">
      <div className="">
        <label htmlFor="search" className="sr-only">
          Enter Binder Contract
        </label>
        <input
          type="address"
          name="address"
          id="address"
          className="block w-full pl-4 py-1 rounded-md border-0 text-ellipsis text-white shadow-sm bg-black ring-1 ring-inset ring-neutral-400 placeholder:text-white placeholder:opacity-40 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
          placeholder={
            config?.binderContract
              ? config.binderContract
              : "Enter the artist Binder Contract"
          }
          onBlur={(e) =>
            setConfig({
              ...config,
              binderContract: e.target.value,
            })
          }
        />
      </div>
      <div className="">
        <label htmlFor="search" className="sr-only">
          Enter Whitelist Collection Address
        </label>
        <input
          type="address"
          name="address"
          id="address"
          className="block w-full pl-4 py-1 rounded-md border-0 text-ellipsis text-white shadow-sm bg-black ring-1 ring-inset ring-neutral-400 placeholder:text-white placeholder:opacity-40 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
          placeholder={
            config?.whitelistedCollectionAddresses?.length
              ? config.whitelistedCollectionAddresses[0]
              : "Enter the artist whitelisted collection address"
          }
          onBlur={(e) =>
            setConfig({
              ...config,
              whitelistedCollectionAddresses: [e.target.value],
            })
          }
        />
      </div>
      <div className="">
        <label htmlFor="search" className="sr-only">
          Enter Network
        </label>
        <input
          type="address"
          name="address"
          id="address"
          className="block w-full pl-4 py-1 rounded-md border-0 text-ellipsis text-white shadow-sm bg-black ring-1 ring-inset ring-neutral-400 placeholder:text-white placeholder:opacity-40 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
          placeholder={
            config?.networkId
              ? config.networkId
              : "Enter the network the campaign is on"
          }
          onBlur={(e) =>
            setConfig({
              ...config,
              networkId: e.target.value as Network,
            })
          }
        />
      </div>
      <BinderButton
        primary={false}
        textColor="text-black"
        title="Create Campaign"
        onClick={async () => {
          const result = await APIHelpers.post("/api/campaigns", {
            body: config,
          });
          const campaign = result.campaign;
          setCampaignId(campaign.campaignId);
        }}
      />
      {camapginId && <div>{`Created Campaign Id: ${camapginId}`}</div>}
      {camapginId && (
        <a
          href={`https://app.signed.gg/collector/${camapginId}`}
          target="_blank"
          className="underline"
        >
          Go to Collector Page
        </a>
      )}
      {camapginId && (
        <a
          href={`https://app.signed.gg/dashboard/${camapginId}/orders`}
          className="underline"
          target="_blank"
        >
          Go to Artist Page
        </a>
      )}
    </div>
  );
}
