"use client";

import { useAuthentication } from "@/hooks/useAuthentication";
import formatWalletAddress from "@/utils/formatWalletAddress";
import DefaultPfp from "public/assets/defaults/pfp.jpg";
import Image from "next/image";
import Loader from "./Loader";
import { User } from "@prisma/client";

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
      <a
        href={
          userToDisplay?.nickname?.includes("@")
            ? `https://twitter.com/${userToDisplay?.nickname}`
            : `https://etherscan.io/address/${userToDisplay?.walletAddresses[0]}`
        }
        target="_blank"
        rel="noreferrer"
      >
        {userToDisplay?.nickname || display}
      </a>
    </span>
  );
}
