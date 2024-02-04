/**
 * Displays login button if not logged in
 * Displays user info if logged in
 */

"use client";

import formatWalletAddress from "@/utils/formatWalletAddress";
import LoginButton from "@/app/components/LoginButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useAuthentication } from "@/hooks/useAuthentication";
import UserInfo from "@/app/components/UserInfo";

const LoginOrUserWidget = () => {
  const { user } = useAuthentication();

  if (!user) {
    return <LoginButton />;
  }
  return (
    <div className="flex flex-row gap-2 items-center w-full justify-between pb-6">
      <UserInfo />
      <LogoutButton size="sm" />
    </div>
  );
};

export default LoginOrUserWidget;
