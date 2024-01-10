"use client";

import LoginOrUserWidget from "@/app/components/LoginOrUserWidget";
import { SignaturePadTest } from "@/app/components/SignaturePad/SignaturePad";
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

const StatusButton = ({
  orderStatus,
  triggerAutograph,
}: {
  orderStatus: NetworkStatus;
  triggerAutograph: () => void;
}) => {
  switch (orderStatus) {
    case "CONFIRMED": {
      return (
        <BinderButton className="w-full mt-2" disabled primary>
          Done
        </BinderButton>
      );
    }
    case "PENDING": {
      return (
        <BinderButton className="w-full mt-2" onClick={triggerAutograph}>
          Fill Order
        </BinderButton>
      );
    }
  }
};

const SubmitStickyButton = () => {
  return (
    <div className="w-full sticky bottom-0 bg-slate-900 pt-8 pb-16">
      <div className="h-full w-full flex flex-col items-center">
        <BinderButton className="w-3/4">Submit</BinderButton>
      </div>
    </div>
  );
};

const AutographModal = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div className="text-black flex flex-col gap-3 items-center">
      {/* top navigation */}
      <div className="flex flex-row justify-between w-full">
        <h2>Hello</h2>
        <button onClick={closeModal}>close</button>
      </div>
      {/* signature pad */}
      <div className="border border-black">
        <SignaturePadTest />
      </div>
      <BinderButton className="w-3/4 bg-black" primary>
        Submit
      </BinderButton>
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
  },
};

export default function Orders({ params }: { params: { campaignId: string } }) {
  const { orders } = useOrders(params.campaignId);
  const triggerAutograph = async () => {
    openModal();
  };
  const [modalIsOpen, setModalOpen] = useState<boolean>(false);
  function openModal() {
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }
  return (
    <Main>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <AutographModal closeModal={closeModal} />
      </Modal>
      <LoginOrUserWidget />
      <div className="self-start">Order List</div>
      <div className="flex flex-row gap-3 gap-y-14 mt-8 flex-wrap">
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
                      triggerAutograph={triggerAutograph}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <SubmitStickyButton />
    </Main>
  );
}
