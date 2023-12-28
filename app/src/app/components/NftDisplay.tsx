import React from "react";
import { networkToName } from "@/lib/utils";

const NFTDisplay = ({
  imageUrl,
  title,
  tokenId,
  networkId,
}: {
  imageUrl: string;
  title: string;
  tokenId?: string;
  networkId: number;
}) => {
  return (
    <div className="flex flex-col rounded-2xl bg-black max-w-[100px] sm:max-w-[252px] hover:opacity-80">
      <img
        src={imageUrl}
        alt={`Unable to load asset`}
        className="rounded-t-2xl h-[100px] sm:h-[252px] object-cover"
      />

      <div className="flex flex-col items-start p-2 sm:p-3 truncate text-ellipsis">
        <div className="text-xs sm:text-md truncate text-ellipsis w-full">
          {title} {tokenId ? `#${tokenId}` : ""}
        </div>
        <div className="relative text-xs text-gray-500 truncate text-ellipsis">
          {networkToName(networkId)}
        </div>
      </div>
    </div>
  );
};

export default NFTDisplay;
