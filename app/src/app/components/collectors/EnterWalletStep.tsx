"use client";

import NFTFeedProfile from "@/app/components/NftFeedProfile";
import { useState } from "react";
import { isAddress } from "@ethersproject/address";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { useInstance } from "@/context/InstanceContext";
import { useSteps } from "@/context/StepsContext";
import { nameToNetwork } from "@/lib/utils";

export default function EnterWalletStep() {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  // search by collection name
  const [searhWord, setSearchword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setInstance } = useInstance();
  const { setCurrentStepIndex } = useSteps();

  function selectAddress(address: string) {
    setError("");
    if (!isAddress(address) && !address.endsWith(".eth")) {
      setError("Invalid wallet address");
      return;
    }

    setSelectedAddress(address.toLowerCase());
  }

  return (
    <div className="flex flex-col gap-4 grow w-full justify-start">
      <h1>Enter a wallet address</h1>
      <div>Enter the wallet address that contains the NFT you want signed</div>
      <div className="flex flex-row w-full">
        <div className="grow">
          <label htmlFor="search" className="sr-only">
            enter address
          </label>
          <input
            type="address"
            name="address"
            id="address"
            className="block w-full pl-4 py-1 rounded-md border-0 text-ellipsis text-white shadow-sm bg-black ring-1 ring-inset ring-neutral-400 placeholder:text-white placeholder:opacity-40 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
            placeholder={
              selectedAddress
                ? selectedAddress
                : "Enter a wallet address or ENS name"
            }
            onChange={(e) => selectAddress(e.target.value)}
          />
        </div>
      </div>
      <ErrorDisplay error={error} />

      {selectedAddress && (
        <NFTFeedProfile
          searchWord={searhWord}
          addresses={[selectedAddress]}
          networkId={nameToNetwork("mainnet")}
          onClickCallback={(
            networkId: string,
            contractAddress: string,
            tokenId: string,
            imageUrl: string,
            name: string
          ) => {
            setInstance({
              nftNetworkId: parseInt(networkId),
              contractAddress,
              tokenId,
              nftUrl: imageUrl,
              name,
            });
            setCurrentStepIndex(1);
          }}
        />
      )}
    </div>
  );
}
