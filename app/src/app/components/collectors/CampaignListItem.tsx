import React, { useEffect, useState } from "react";
import { nameToNetwork } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { NetworkStatus, Order } from "@prisma/client";
import NFTDisplayFull, { BinderNFT } from "../NftDisplayFull";
import { getNftMetadata } from "@/lib/alchemy";
import Link from "next/link";
import { useCampaignSelectedOrder } from "@/context/campaignSelectedOrderContext";

type Size = "default" | "lg" | "md";

const sizeClass = {
  default: "h-[300px] w-full max-w-[252px]",
  lg: "h-[350px] w-[252px]",
  md: "h-[200px] w-[120px]",
};

const sizeToClass = (size: Size) => sizeClass[size];

const ipadPro = "(max-width: 1024px)";

const CampaignListItem = ({
  order,
}: {
  order: Order;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { setOrder } = useCampaignSelectedOrder();
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
  const notClickable = order.status !== NetworkStatus.CONFIRMED;
  return (
    <div
      className={`flex flex-col rounded-2xl bg-black ${
        notClickable ? "" : "hover:-translate-y-1 transition-all duration-200"
      } gap-4 ${isIpadPro ? sizeToClass("md") : sizeToClass("default")}`}
    >
      {order.collectionNetwork &&
        order.selectedTokenId &&
        order.collectionAddress &&
        nft && (
          <div
            onClick={() => {
              if (order.status === NetworkStatus.CONFIRMED) {
                const orderWithImage = {
                  ...order,
                  image: nft.imageUrl,
                };
                setOrder(orderWithImage);
              } else {
              }
            }}
          >
            <NFTDisplayFull
              networkId={nameToNetwork(order.collectionNetwork)}
              tokenId={order.selectedTokenId}
              contractAddress={order.collectionAddress!}
              imageOnly={true}
            />
            <div className="p-3 text-sm rounded-2xl bg-black text-neutral-500 overflow-clip flex flex-col gap-2 w-full">
              <div className="text-md font-bold text-white text-sm">
                Waiting to be ✍️
              </div>
              <div className=" overflow-clip text-ellipsis text-sm">
                {`${
                  order.status === NetworkStatus.CONFIRMED ? "Signed on " : ""
                } ${nft.title}`}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CampaignListItem;
