import React from "react";
import { networkToName } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Size = "default" | "lg" | "md";

const sizeClass = {
  default: "h-[300px] w-full",
  lg: "h-[350px] w-[252px]",
  md: "h-[300px] w-[150px]",
};

const sizeToClass = (size: Size) => sizeClass[size];

const imageSizeClass = {
  default: "h-[250px] w-full",
  lg: "h-[350px] w-[252px]",
  md: "h-[250px] w-[200px]",
};

const imageSiToClass = (size: Size) => imageSizeClass[size];

const ipadPro = "(max-width: 1024px)";

const NFTDisplay = ({
  imageUrl,
  title,
  tokenId,
  networkId,
  size = "default",
  ...props
}: {
  imageUrl: string;
  title: string;
  tokenId?: string;
  networkId: number;
  size?: Size;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const isIpadPro = useMediaQuery(ipadPro);

  return (
    <div
      {...props}
      className={`flex flex-col rounded-2xl bg-black hover:opacity-80 ${
        isIpadPro ? sizeToClass("md") : sizeToClass(size)
      }`}
    >
      <img
        src={imageUrl}
        alt={`Unable to load asset`}
        className={`rounded-t-2xl  object-cover  ${
          isIpadPro ? imageSiToClass("md") : imageSiToClass(size)
        }`}
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
