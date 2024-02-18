"use client";

import { useState } from "react";
import Image from "next/image";
import BinderButton from "./BinderButton";

export default function WelcomeModalPage1() {
  return (
    <div className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]flex flex-col items-center justify-center rounded-lg bg-neutral-90 hover:cursor-pointer flex-1 ">
      <div className="mt-4 flex flex-col items-center gap-8 transition ease-in-out delay-150">
        <img
          src="/assets/welcome_modal.jpg
      "
          alt=""
          className="rounded-lg h-40 sm:h-96"
        />
        <div className="text-xl ">Welcome!</div>
        <div>This is your dashboard for signing autographs</div>
      </div>
    </div>
  );
}
