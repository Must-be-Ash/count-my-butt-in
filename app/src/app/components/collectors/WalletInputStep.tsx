"use client";

import NFTFeedProfile from "@/app/components/NftFeedProfile";
import { useState } from "react";
import { isAddress } from "@ethersproject/address";
import ErrorDisplay from "@/app/components/ErrorDisplay";

export default function WalletInputStep() {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  // search by collection name
  const [searhWord, setSearchword] = useState<string>("");
  const [error, setError] = useState<string>("");

  function selectAddress(address: string) {
    if (!isAddress(address)) {
      setError("Invalid wallet address");
      return;
    }

    setSelectedAddress(address);
  }

  return (
    <div className="flex flex-col justify-between h-full py-4">
      <div className="flex flex-col gap-4 grow">
        <h1>Enter a wallet address</h1>
        <div>
          Enter the wallet address that contains the NFT you want signed
        </div>
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
              onBlur={(e) => selectAddress(e.target.value)}
            />
          </div>
        </div>
        <ErrorDisplay error={error} />

        {selectedAddress && (
          <NFTFeedProfile
            searchWord={searhWord}
            addresses={[selectedAddress]}
            networkId={1}
            onClickCallback={(_: string, __: string, ___: string) => {
              console.log("clicked");
            }}
          />
        )}
      </div>
    </div>
  );
}
