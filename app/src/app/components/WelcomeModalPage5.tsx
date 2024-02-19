"use client";

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
export default function WelcomeModalPage5() {
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
          src="/assets/check_icon.png
      "
          alt=""
          className="rounded-lg h-28"
        />
        <div className="text-xl ">Step 4</div>
        <div>Once you’re done signing autographs press ‘submit’</div>
      </div>
    </motion.div>
  );
}
