import React, { useEffect, useState } from "react";
import { nameToNetwork } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { Order } from "@prisma/client";
import NFTDisplayFull, { BinderNFT } from "../NftDisplayFull";
import { getNftMetadata } from "@/lib/alchemy";
import Link from "next/link";

type Size = "default" | "lg" | "md";

const sizeClass = {
  default: "h-[300px] w-full max-w-[252px]",
  lg: "h-[350px] w-[252px]",
  md: "h-[300px] w-[150px]",
};

const sizeToClass = (size: Size) => sizeClass[size];

const ipadPro = "(max-width: 1024px)";

const OrdersListItem = ({
  order,
}: {
  order: Order;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const isIpadPro = useMediaQuery(ipadPro);
  const [nft, setNft] = useState<BinderNFT | null>(null);

  useEffect(() => {
    async function getNft() {
      const nft = await getNftMetadata(
        nameToNetwork(order.collectionNetwork),
        order.collectionAddress,
        order.selectedTokenId
      );
      const media = nft?.media[0];
      setNft({
        imageUrl: media.thumbnail || media.gateway || media.raw,
        title: nft.title || nft.contract.name || "Unknown",
        tokenId: order.selectedTokenId,
        networkId: nameToNetwork(order.collectionNetwork),
      });
    }
    getNft();
  }, [order]);

  return (
    <div
      className={`flex flex-col rounded-2xl bg-black hover:opacity-80 ${
        isIpadPro ? sizeToClass("md") : sizeToClass("default")
      }`}
    >
      {order.mintedNetworkId &&
        order.mintedTokenId &&
        order.mintedContractAddress &&
        nft && (
          <Link
            href={`/asset/${order.collectionNetwork.toLowerCase()}/${
              order.collectionAddress
            }/${nft.tokenId}`}
            className="w-full"
          >
            <NFTDisplayFull
              networkId={nameToNetwork(order.mintedNetworkId)}
              tokenId={order.mintedTokenId}
              contractAddress={order.mintedContractAddress!}
              imageOnly={true}
            />
            <div className="p-3 text-sm rounded-2xl bg-black text-neutral-500 whitespace-nowrap overflow-clip flex flex-col gap-2 w-full">
              <div className="whitespace-nowrap overflow-clip text-ellipsis ">
                Signed on {nft.title}
              </div>
            </div>
          </Link>
        )}
    </div>
  );
};

export default OrdersListItem;
