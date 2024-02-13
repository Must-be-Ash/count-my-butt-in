import React, { useEffect, useState } from "react";
import { getOpenseaLink, networkToName } from "@/lib/utils";
import { getNftMetadata } from "@/lib/alchemy";
import Loader from "@/app/components/Loader";

export interface BinderNFT {
  imageUrl: string;
  title: string;
  tokenId?: string;
  networkId: number;
}

const NFTDisplayFull = ({
  contractAddress,
  tokenId,
  networkId,
  imageOnly,
  notClickable,
}: {
  contractAddress: string;
  tokenId: string;
  networkId: number;
  imageOnly?: boolean;
  notClickable?: boolean;
}) => {
  const [nft, setNft] = useState<BinderNFT | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    async function getNft() {
      setIsLoading(true);
      const nft = await getNftMetadata(networkId, contractAddress, tokenId);
      const media = nft?.media[0];
      if (media) {
        const imageUrl = media.thumbnail || media.gateway || media.raw;

        setNft({
          imageUrl,
          title: nft.title || nft.contract.name || "Unknown",
          tokenId,
          networkId,
        });
      }
      setIsLoading(false);
    }
    getNft();
  }, [contractAddress, tokenId, networkId]);

  return (
    <>
      {nft && !isLoading && (
        <div
          className={`flex flex-col items-center justify-center rounded-2xl bg-black ${
            notClickable ? "" : "cursor-pointer"
          }`}
        >
          <img
            src={nft.imageUrl}
            alt={`Unable to load asset`}
            className="rounded-t-2xl w-full sm:h-[252px] h-[200px] object-cover"
          />

          {!imageOnly && (
            <div className="flex flex-col items-start p-4 sm:p-3 truncate text-ellipsis w-full">
              <div className="text-xs sm:text-md truncate text-ellipsis w-full">
                {nft.title} {tokenId ? `#${tokenId}` : ""}
              </div>
              <div className="relative text-xs text-gray-500 truncate text-ellipsis">
                {networkToName(nft.networkId)}
              </div>
            </div>
          )}
        </div>
      )}
      {isLoading && (
        <div className="flex flex-row items-center justify-center w-full mx-auto h-[252px]">
          <Loader color="black" />
        </div>
      )}
    </>
  );
};

export default NFTDisplayFull;
