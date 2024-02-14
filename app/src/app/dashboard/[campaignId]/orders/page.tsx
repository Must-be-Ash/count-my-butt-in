"use client";

import SignaturePadTest from "@/app/components/SignaturePad/SignaturePad";
import BinderButton from "@/app/components/BinderButton";
import Main from "@/app/layouts/Main";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import NFTDisplayFull from "@/app/components/NftDisplayFull";
import { nameToNetwork } from "@/lib/utils";
import { NetworkStatus, Order } from "@prisma/client";
import { getNftMetadata } from "@/lib/alchemy";
import { useCampaign } from "@/hooks/useCampaign";
import { AuthenticatedPage } from "@/app/components/page/AuthenticatedPage";
import { IoCheckmark } from "react-icons/io5";
import formatLongString from "@/utils/formatLongString";
import { BiCopy } from "react-icons/bi";
import { Credenza, CredenzaContent } from "@/components/ui/credenza";
import APIHelpers from "@/lib/apiHelper";
import BatchMint from "@/app/components/dashboard/orders/BatchMintButton";
import { BINDER_DROP_TOKEN } from "@/utils/common";

export default function Orders({ params }: { params: { campaignId: string } }) {
  const [hostname, setHostname] = useState<string>("https://portal.signed.gg");
  const COLLECTOR_LINK = `${hostname}/collector/${params.campaignId}/home`;
  // const COLLECTOR_LINK = `${hostname}`;
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [signature, setSignature] = useState<string>();
  const [recipients, setRecipients] = useState<string[]>();
  const [nonce, setNonce] = useState<string>();

  useEffect(() => {
    try {
      if (window) {
        setHostname(window.location.origin);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const copyText = (text: string) => {
    setIsCopied((c) => !c);
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (isCopied) {
      let tmr = setTimeout(() => setIsCopied(false), 1 * 1000);
      return () => {
        clearTimeout(tmr);
      };
    }
  }, [isCopied]);

  const { orders, refetchOrders } = useOrders(params.campaignId);
  const { campaign } = useCampaign(params.campaignId);
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const triggerAutograph = async (order: Order) => {
    setSelectedOrder(order);
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

  const pendingOrders = orders?.sort((a, b) => a.createdAt - b.createdAt);
  useEffect(() => {
    async function run() {
      if (campaign?.manifestUrl) {
        const tokenMappings = pendingOrders?.map((order) => ({
          contractAddress: order.collectionAddress,
          tokenId: order.selectedTokenId,
        }));
        const { recipients, signature, nonce } = await APIHelpers.post(
          `/api/campaigns/${params.campaignId}/batchSign`,
          {
            body: {
              networkId: 1,
              tokenMappings,
            },
          }
        );

        setSignature(signature);
        setRecipients(recipients);
        setNonce(nonce);
      }
    }
    run();
  }, [orders]);

  return (
    <AuthenticatedPage homeRoute={`/`} requiredUserId={campaign?.userId}>
      <Main>
        <Credenza open={modalIsOpen} onOpenChange={setModalOpen}>
          <CredenzaContent className="dark:bg-transparent dark:border-0 flex flex-col">
            <SignaturePadTest
              campaignId={params.campaignId}
              order={selectedOrder!}
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
            {formatLongString(COLLECTOR_LINK, 22, 15)}
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
                        triggerAutograph(order);
                      }}
                      className="w-full"
                    >
                      {!order.toUpload ? "FILL ORDER" : "DONE"}
                    </BinderButton>
                  </div>
                </div>
              );
            })}
          {orders?.length === 0 && <div>No orders found for the campaign</div>}
        </div>

        {campaign &&
          !!pendingOrders &&
          campaign.manifestUrl &&
          signature &&
          nonce &&
          recipients && (
            <div className="w-full sticky bottom-0  pt-8 pb-8 mt-8 backdrop-blur-lg shadow-lg">
              <div className="h-full w-full flex flex-col items-center">
                <BatchMint
                  campaignNetworkId={nameToNetwork(campaign.networkId)}
                  orderIds={pendingOrders?.map((order) => order.orderId)}
                  binderContract={BINDER_DROP_TOKEN}
                  signature={signature}
                  recipients={recipients}
                  uris={pendingOrders.map(
                    (order, index) => `${campaign.manifestUrl}/${index + 1}`
                  )}
                  nonce={nonce}
                />
              </div>
            </div>
          )}
      </Main>
    </AuthenticatedPage>
  );
}
