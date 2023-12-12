"use client";

import { usePrivy } from "@privy-io/react-auth";
import BinderButton from "@/app/components/binderButton";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
  const { logout } = usePrivy();
  return <ArrowRightOnRectangleIcon className="h-2 w-2" onClick={logout} />;
}
