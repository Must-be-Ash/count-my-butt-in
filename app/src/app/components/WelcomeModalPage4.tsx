"use client";

import { useState } from "react";
import Image from "next/image";
import BinderButton from "./BinderButton";
import { motion } from "framer-motion";

const trafficVariant = {
  out: { scale: 0, transition: { when: "afterChildren" } },
  in: {
    scale: 1,
    transition: {
      duration: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.2,
      staggerDirection: -0.5,
    },
  },
  exit: { transition: {} },
};

export default function WelcomeModalPage4() {
  return (
    <motion.div
      variants={trafficVariant}
      initial="out"
      animate="in"
      exit="exit"
      className="flex flex-col items-center justify-center rounded-lg bg-neutral-90 hover:cursor-pointer flex-1 "
    >
      <div className="mt-4 flex flex-col items-center gap-10">
        <img
          src="/assets/sign_icon.png
      "
          alt=""
          className="rounded-lg h-40 sm:h-40"
        />
        <div className="text-xl ">Step 3</div>
        <div>
          Sign the orders, you’ll know they’re finished one the ‘submit’ button
          appears
        </div>
      </div>
    </motion.div>
  );
}
