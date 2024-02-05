"use client";

import BinderButton from "@/app/components/BinderButton";
import LogoutButton from "./LogoutButton";
import { useWallets } from "@privy-io/react-auth";
import DeployButton from "./admin/deploy/DeployButton";
import { SUPPORTED_NETWORKS, binderFactoryContract } from "@/utils/common";
import { useAuthentication } from "@/hooks/useAuthentication";

import { networkToName } from "@/lib/utils";
import { useState } from "react";

export default function LoginButton({
  title,
  className,
}: {
  title?: string;
  className?: any;
}) {
  const { login, authenticated } = useAuthentication();

  if (authenticated) {
    return <LogoutButton size="lg" withText className={className} />;
  }

  return (
    <BinderButton className={className} onClick={login}>
      {title || "Login"}
    </BinderButton>
  );
}
