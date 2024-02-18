"use client";

import { Credenza, CredenzaContent } from "@/components/ui/credenza";
import { useState } from "react";
import Image from "next/image";
import BinderButton from "./BinderButton";
import WelcomeModalPage1 from "./WelcomeModalPage1";
import WelcomeModalPage2 from "./WelcomeModalPage2";
import WelcomeModalPage3 from "./WelcomeModalPage3";
import WelcomeModalPage4 from "./WelcomeModalPage4";
import WelcomeModalPage5 from "./WelcomeModalPage5";

export default function WelcomeModal() {
  const hasOpened = localStorage.getItem("hasOpened");
  const [modalIsOpen, setModalOpen] = useState(hasOpened !== "true");
  const [page, setPage] = useState(1);

  function dismissModal() {
    localStorage.setItem("hasOpened", "true");
    setModalOpen(false);
  }
  return (
    <Credenza open={modalIsOpen} onOpenChange={setModalOpen}>
      <CredenzaContent
        className="dark:bg-transparent dark:border-0 flex flex-col h-full"
        hideX={true}
      >
        <div className="flex flex-col justify-between items-center">
          <div className="relative flex flex-col items-center">
            <Image
              src="/assets/signed_gg_logo.png"
              alt="binder-logo"
              width="50"
              height="50"
              sizes="100vw"
            />
            <div className="text-sm mt-2">autographs for digital media</div>
          </div>
          <div className="flex flex-col mt-12">
            <div className="transition-all relative flex place-items-center place-self-center">
              <div className="flex flex-row">
                <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-90 hover:cursor-pointer flex-1 mx-5">
                  <div className="transition-all ease-in-out delay-150 mt-4 flex flex-col items-center gap-4 text-center bg-black p-4 rounded-lg">
                    {page === 1 && <WelcomeModalPage1 />}
                    {page === 2 && <WelcomeModalPage2 />}
                    {page === 3 && <WelcomeModalPage3 />}
                    {page === 4 && <WelcomeModalPage4 />}
                    {page === 5 && <WelcomeModalPage5 />}
                  </div>
                  <BinderButton
                    className="w-full mt-6"
                    onClick={() =>
                      page !== 5 ? setPage(page + 1) : dismissModal()
                    }
                  >
                    {page !== 5 ? "Next" : "Lets go!"}
                  </BinderButton>
                  <BinderButton
                    className="w-full mt-2"
                    variant={"ghost"}
                    onClick={() => dismissModal()}
                  >
                    Skip intro
                  </BinderButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
