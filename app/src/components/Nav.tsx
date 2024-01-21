/**
 * Displays login button if not logged in
 * Displays user info if logged in
 */

"use client";
import { usePrivy } from "@privy-io/react-auth";
import formatWalletAddress from "@/utils/formatWalletAddress";
import DefaultPfp from "public/assets/defaults/pfp.jpg";
import Image from "next/image";
import LoginButton from "@/app/components/LoginButton";
import LogoutButton from "@/app/components/LogoutButton";

const LoginOrUserWidget = () => {
  const { user } = usePrivy();
  const display = formatWalletAddress(user?.wallet?.address);
  if (!user) {
    return <LoginButton />;
  }
  return (
    <div className="flex flex-row gap-2 items-center w-full justify-between pb-6">
      <span className="flex flex-row gap-2 items-center">
        <Image
          src={DefaultPfp}
          alt="profile picture"
          className="rounded-full w-8 h-8"
        />
        <span>{display}</span>
      </span>
      <LogoutButton size="sm" />
    </div>
  );
};

export default LoginOrUserWidget;
