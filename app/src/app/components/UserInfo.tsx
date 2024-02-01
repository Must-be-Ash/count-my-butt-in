"use client";

import { useAuthentication } from "@/hooks/useAuthentication";
import formatWalletAddress from "@/utils/formatWalletAddress";
import DefaultPfp from "public/assets/defaults/pfp.jpg";
import Image from "next/image";
import Loader from "./Loader";
import { User } from "@prisma/client";
import { FaXTwitter } from "react-icons/fa6";
import { TbCurrencyEthereum } from "react-icons/tb";
import { FaWallet } from "react-icons/fa";

export default function UserInfo({ overrideUser }: { overrideUser?: User }) {
  const { authenticatedUser } = useAuthentication();
  let userToDisplay = overrideUser || authenticatedUser;
  const display = formatWalletAddress(userToDisplay?.walletAddresses[0]);
  if (!userToDisplay) {
    return <Loader />;
  }

  return (
    <span className="flex flex-row gap-2 items-center">
      <Image
        src={userToDisplay?.imageUrl || DefaultPfp}
        alt="profile picture"
        className="rounded-full w-8 h-8"
        width={32}
        height={32}
      />
      <div className="font-sans font-bold uppercase text-sm">
        {userToDisplay?.nickname || display}
      </div>
      {userToDisplay?.nickname.includes("@") && <a href={`https://twitter.com/${userToDisplay?.nickname}`} target="_blank" className="cursor-pointer">
        <FaXTwitter />
      </a>}
      {userToDisplay?.walletAddresses[0] && <a href={`https://etherscan.io/address/${userToDisplay?.walletAddresses[0]}`} target="_blank" className="cursor-pointer">
        <FaWallet />
      </a>}
      {userToDisplay?.campaign.binderContract && <a href={`https://etherscan.io/address/${userToDisplay?.campaign.binderContract}`} target="_blank" className="cursor-pointer">
        <TbCurrencyEthereum />
      </a>}
    </span>
  );
}
