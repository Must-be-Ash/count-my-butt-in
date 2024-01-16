/**
 * Displays login button if not logged in
 * Displays user info if logged in
 */

"use client";
import { usePrivy } from "@privy-io/react-auth";
import LoginButton from "./LoginButton";
import formatWalletAddress from "@/utils/formatWalletAddress";
import LogoutButton from "./LogoutButton";
import DefaultPfp from "public/assets/defaults/pfp.jpg";
import Image from "next/image";

const LoginOrUserWidget = () => {
  const { user } = usePrivy();
  const display = formatWalletAddress(user?.wallet?.address);
  if (!user) {
    return <LoginButton />;
  }
  return (
    <div className="flex flex-row gap-2 items-center w-full justify-between py-4">
      <span className="flex flex-row gap-2 items-center">
        <Image
          src={DefaultPfp}
          alt="profile picture"
          className="rounded-full w-8 h-8"
        />
        <span>{display}</span>
      </span>
      <LogoutButton size="lg" withText />
    </div>
  );
};

export default LoginOrUserWidget;
