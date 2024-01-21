"use client";

import SignaturePadTest from "@/app/components/SignaturePad/SignaturePad";
import BinderButton from "@/app/components/BinderButton";
import Main from "@/app/layouts/Main";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import NFTDisplayFull from "@/app/components/NftDisplayFull";
import { nameToNetwork } from "@/lib/utils";
import { NetworkStatus } from "@prisma/client";
import { getNftMetadata } from "@/lib/alchemy";
import TokenUriUpdateButton from "@/app/components/dashboard/orders/TokenUriUpdateButton";
import { useCampaign } from "@/hooks/useCampaign";
import { AuthenticatedPage } from "@/app/components/page/AuthenticatedPage";
import { IoCheckmark } from "react-icons/io5";
import formatLongURL from "@/utils/formatLongURL";
import { BiCopy } from "react-icons/bi";
import {
  Credenza,
  CredenzaContent,
} from "@/components/ui/credenza"

export default function Orders({ params }: { params: { campaignId: string } }) {
  const [hostname, setHostname] = useState<string>("https://app.signed.gg");
  const COLLECTOR_LINK = `${hostname}/collector/${params.campaignId}/home`;
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {if (window) {setHostname(window.location.origin)}}, [window])

  const copyText = (text: string) => {
    setIsCopied((c) => !c);
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (isCopied) {
      let tmr = setTimeout(() => setIsCopied(false), 1 * 1000);
      return () => { clearTimeout(tmr); };
    }
  }, [isCopied])

  const { orders, refetchOrders } = useOrders(params.campaignId);
  const { campaign } = useCampaign(params.campaignId);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const triggerAutograph = async (orderId: string) => {
    setSelectedOrderId(orderId);
    openModal();
  };
  const [modalIsOpen, setModalOpen] = useState<boolean>(false);
  function openModal() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    refetchOrders();
  }
  return (
    <AuthenticatedPage homeRoute={`/dashboard/${params.campaignId}`}>
      <Main>
        <Credenza open={modalIsOpen} onOpenChange={setModalOpen}>
          <CredenzaContent className="dark:bg-transparent dark:border-0">
            <SignaturePadTest
              campaignId={params.campaignId}
              orderId={selectedOrderId}
              closeModal={closeModal}
              backgroundImage={imageUrl}
            />
          </CredenzaContent>
        </Credenza>
        <div
          className="flex flex-row bg-gray-700 rounded-full text-base gap-2 my-2 items-center cursor-pointer w-full"
          onClick={() => copyText(COLLECTOR_LINK)}
        >
          <div className="py-2 flex-1 text-xs pl-4">
            {formatLongURL(COLLECTOR_LINK, 22, 15)}
          </div>
          <div
            className={`rounded-full p-[6px] text-lg text-gray-600 ${
              isCopied ? "bg-green-300" : "bg-gray-300"
            }`}
          >
            {isCopied ? <IoCheckmark /> : <BiCopy />}
          </div>
        </div>
        <div className="text-xs">
          Copy the link above and share with your collectors
        </div>

        <div className="capitalize font-semibold pt-6">Order List</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 gap-y-14 mt-8 mb-8">
          {!!orders &&
            orders.length > 0 &&
            orders.map((order, key) => {
              return (
                <div key={key} className="bg-black rounded-2xl">
                  <div className="rounded-2xl relative">
                    {/* image */}
                    <NFTDisplayFull
                      networkId={nameToNetwork(order.collectionNetwork)}
                      tokenId={order.selectedTokenId}
                      contractAddress={order.collectionAddress}
                    />
                  </div>
                  {/* content */}
                  <div className="p-3 w-full">
                      <BinderButton
                        onClick={async () => {
                          const nft = await getNftMetadata(
                            nameToNetwork(order.collectionNetwork),
                            order.collectionAddress,
                            order.selectedTokenId
                          );
                          const media = nft?.media[0];
                          if (media) {
                            const imageUrl =
                              media.thumbnail || media.gateway || media.raw;
                            setImageUrl(imageUrl);
                          }
                          triggerAutograph(order.orderId);
                        }}
                        className="w-full"
                      >{order.status === "PENDING" ? "FILL ORDER" : "DONE"}</BinderButton>
                  </div>
                </div>
              );
            })}
          {orders?.length === 0 && <div>No orders found for the campaign</div>}
        </div>

          {campaign &&
            campaign.binderContract &&
            !!orders &&
            campaign.manifestUrl && (
              <div className="w-full sticky bottom-0  pt-8 pb-8 mt-8 backdrop-blur-lg shadow-lg">
                <div className="h-full w-full flex flex-col items-center">
                  <TokenUriUpdateButton
                    revealedTokenIdBoundary={
                      orders
                        .filter((order) => order.mintedTokenId)
                        .map((order) => Number(order.mintedTokenId))
                        .sort((a, b) => b - a)[0] || 0 // get the largest tokenId
                    }
                    revealedURI={campaign.manifestUrl}
                    campaignNetworkId={nameToNetwork(campaign.networkId)}
                    binderContract={campaign.binderContract}
                  />
                </div>
              </div>
            )}
      </Main>
    </AuthenticatedPage>
  );
}
