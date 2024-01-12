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
}: {
  contractAddress: string;
  tokenId: string;
  networkId: number;
  imageOnly?: boolean;
}) => {
  const [nft, setNft] = useState<BinderNFT | null>(null);

  useEffect(() => {
    async function getNft() {
      console.log("qwdqwd", networkId);
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
    }
    getNft();
  }, [contractAddress, tokenId, networkId]);

  return (
    <>
      {nft && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-black max-w-[100px] sm:max-w-[252px] cursor-pointer">
          <img
            src={nft.imageUrl}
            alt={`Unable to load asset`}
            className="rounded-t-2xl h-[100px] sm:h-[252px] object-cover"
          />

          {!imageOnly && (
            <div className="flex flex-col items-start p-2 sm:p-3 truncate text-ellipsis">
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
      {!nft && (
        <div className="flex flex-row items-center justify-center w-full mx-auto">
          <Loader />
        </div>
      )}
    </>
  );
};

export default NFTDisplayFull;
