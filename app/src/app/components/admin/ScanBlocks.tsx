"use client";
import { useState } from "react";
import { Campaign, Network } from "@prisma/client";
import BinderButton from "@/app/components/BinderButton";
import APIHelpers from "@/lib/apiHelper";

export interface ScanConfig {
  fromBlock?: number;
  toBlock?: number;
  contractAddress?: string;
  networkId?: number;
}
export default function ScanBlocks() {
  const [config, setConfig] = useState<ScanConfig | undefined>();

  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="">
        <label htmlFor="search" className="sr-only">
          From Block
        </label>
        <input
          type="fromBlock"
          name="fromBlock"
          id="fromBlock"
          className="block w-full pl-4 py-1 rounded-md border-0 text-ellipsis text-white shadow-sm bg-black ring-1 ring-inset ring-neutral-400 placeholder:text-white placeholder:opacity-40 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
          placeholder={
            config?.fromBlock?.toString()
              ? config.fromBlock.toString()
              : "Enter from block"
          }
          onBlur={(e) =>
            setConfig({
              ...config,
              fromBlock: Number(e.target.value),
            })
          }
        />
      </div>
      <div className="">
        <label htmlFor="search" className="sr-only">
          Enter To Block
        </label>
        <input
          type="toBlock"
          name="toBlock"
          id="toBlock"
          className="block w-full pl-4 py-1 rounded-md border-0 text-ellipsis text-white shadow-sm bg-black ring-1 ring-inset ring-neutral-400 placeholder:text-white placeholder:opacity-40 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
          placeholder={
            config?.toBlock?.toString()
              ? config?.toBlock?.toString()
              : "Enter to block"
          }
          onBlur={(e) =>
            setConfig({
              ...config,
              toBlock: Number(e.target.value),
            })
          }
        />
      </div>
      <div className="">
        <label htmlFor="search" className="sr-only">
          Enter contract address
        </label>
        <input
          type="address"
          name="address"
          id="address"
          className="block w-full pl-4 py-1 rounded-md border-0 text-ellipsis text-white shadow-sm bg-black ring-1 ring-inset ring-neutral-400 placeholder:text-white placeholder:opacity-40 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
          placeholder={
            config?.contractAddress
              ? config.contractAddress
              : "Enter contract address"
          }
          onBlur={(e) =>
            setConfig({
              ...config,
              contractAddress: e.target.value,
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
            config?.networkId?.toString()
              ? config.networkId.toString()
              : "Enter the network to scan"
          }
          onBlur={(e) =>
            setConfig({
              ...config,
              networkId: Number(e.target.value),
            })
          }
        />
      </div>
      <BinderButton
        onClick={async () => {
          const result = await APIHelpers.post("/api/scan", {
            body: config as any,
          });
        }}
      >Scan</BinderButton>
    </div>
  );
}
