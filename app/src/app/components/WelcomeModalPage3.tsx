"use client";

import { useState } from "react";
import Image from "next/image";
import BinderButton from "./BinderButton";

export default function WelcomeModalPage3() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-90 hover:cursor-pointer flex-1 ">
      <div className="mt-4 flex flex-col items-center gap-10">
        <img
          src="/assets/wait_icon.png
      "
          alt=""
          className="rounded-lg h-40 sm:h-40"
        />
        <div className="text-xl ">Step 2</div>
        <div>Wait until the requests come in. it shouldn’t take long</div>
      </div>
    </div>
  );
}
