/**
 * Displays login button if not logged in
 * Displays user info if logged in
 */

"use client";

import LoginButton from "@/app/components/LoginButton";
import LogoutButton from "@/app/components/LogoutButton";
import { useAuthentication } from "@/hooks/useAuthentication";
import UserInfo from "@/app/components/UserInfo";
import { Notebook } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ViewAllCampaignsButton = () => {
  return (
    <Link
      href={`/dashboard/campaigns`}
      className="flex flex-row gap-2 px-4 py-2  border-dashed border-2 border-white rounded-lg cursor-pointer justify-end sm:text-sm text-xs"
    >
      <Notebook className="w-5 h-5" />
      <span className="hidden sm:block">View Campaigns</span>
    </Link>
  );
};

const LoginOrUserWidget = () => {
  const { user } = useAuthentication();
  const path = usePathname();
  const isOnDashboard =
    path.includes("/dashboard") && path !== "/dashboard/campaigns";

  if (!user) {
    return <LoginButton />;
  }
  return (
    <div className="flex flex-row gap-2 items-center w-full justify-between pb-6">
      <UserInfo />
      <div className="flex flex-row gap-2">
        {isOnDashboard && <ViewAllCampaignsButton />}
        <LogoutButton size="sm" />
      </div>
    </div>
  );
};

export default LoginOrUserWidget;
