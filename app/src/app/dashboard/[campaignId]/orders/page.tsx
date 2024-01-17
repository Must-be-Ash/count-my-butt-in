"use client";

import LoginOrUserWidget from "@/app/components/LoginOrUserWidget";
import SignaturePadTest from "@/app/components/SignaturePad/SignaturePad";
import BinderButton from "@/app/components/BinderButton";
import Main from "@/app/layouts/Main";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-modal";
import { useOrders } from "@/hooks/useOrders";
import NftDisplayFull from "@/app/components/NftDisplayFull";
import NFTDisplayFull from "@/app/components/NftDisplayFull";
import Loader from "@/app/components/Loader";
import { nameToNetwork } from "@/lib/utils";
import { NetworkStatus } from "@prisma/client";
import { getNftMetadata } from "@/lib/alchemy";
import { set } from "zod";
import TokenUriUpdateButton from "@/app/components/dashboard/orders/TokenUriUpdateButton";
import { useCampaign } from "@/hooks/useCampaign";
import { AuthenticatedPage } from "@/app/components/page/AuthenticatedPage";
import { FaRegCopy } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";


const StatusButton = ({
  orderStatus,
  triggerAutograph,
}: {
  orderStatus: NetworkStatus;
  triggerAutograph: () => void;
}) => (
  <BinderButton
    className="w-full mt-2"
    onClick={triggerAutograph}
    title={orderStatus === "PENDING" ? "FILL ORDER" : "DONE"}
  />
);

const AutographModal = ({
  campaignId,
  orderId,
  closeModal,
  backgroundImage,
}: {
  campaignId: string;
  orderId: string;
  closeModal: () => void;
  backgroundImage: string;
}) => {
  return (
    <div className="text-black flex flex-col gap-3 items-center">
      <div className="flex flex-row justify-between w-full">
        <div>Make your mark</div>
        <button onClick={closeModal}>X</button>
      </div>
      {/* signature pad */}
      <SignaturePadTest
        campaignId={campaignId}
        orderId={orderId}
        closeModal={closeModal}
        backgroundImage={backgroundImage}
      />
    </div>
  );
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "550px",
    width: "550px"
  },
};

export default function Orders({ params }: { params: { campaignId: string } }) {
  const COLLECTOR_LINK=`https://app.signed.gg/dashboard/${params.campaignId}/orders`
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyText = (text: string) => {
    setIsCopied(false);
    navigator.clipboard.writeText(text)
    setIsCopied(true);
  }

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
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <AutographModal
            campaignId={params.campaignId}
            orderId={selectedOrderId}
            closeModal={closeModal}
            backgroundImage={imageUrl}
          />
        </Modal>
        <LoginOrUserWidget />
        <div className="flex flex-row border-2 border-white rounded-md text-base gap-3 p-1 items-center cursor-pointer" onClick={() => copyText(COLLECTOR_LINK)}>
          <div className="w-1/4">
            <FaPeopleGroup />
          </div>
          <div className="py-2 font-mono flex-1 text-xs">
            {COLLECTOR_LINK}
          </div>
          <div className="text-xl">
           {isCopied ? <IoMdCheckmarkCircleOutline /> : <FaRegCopy />}
          </div>
        </div>

        <div className="capitalize font-semibold pt-6">Order List</div>
        <div className="flex flex-row gap-3 gap-y-14 mt-8 flex-wrap mb-8">
          {!!orders &&
            orders.length > 0 &&
            orders.map((order, key) => {
              return (
                <div
                  key={key}
                  className="h-[265px] w-[173px] bg-black rounded-lg"
                >
                  <div className="h-[180px] w-[173px] rounded-t-lg relative">
                    {/* image */}
                    <NFTDisplayFull
                      networkId={nameToNetwork(order.collectionNetwork)}
                      tokenId={order.selectedTokenId}
                      contractAddress={order.collectionAddress}
                    />
                  </div>
                  {/* content */}
                  <div className="p-3">
                    <div>
                      <StatusButton
                        orderStatus={order.status || "PENDING"}
                        triggerAutograph={async () => {
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
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          {orders?.length === 0 && <div>No orders found for the campaign</div>}
        </div>
        <div className="w-full sticky bottom-0  pt-8 pb-8 mt-8">
          {campaign &&
            campaign.binderContract &&
            !!orders &&
            campaign.manifestUrl && (
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
            )}
        </div>
      </Main>
    </AuthenticatedPage>
  );
}
