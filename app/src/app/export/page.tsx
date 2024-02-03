"use client";

import BinderButton from "@/app/components/BinderButton";
import LoginButton from "@/app/components/LoginButton";
import APIHelpers from "@/lib/apiHelper";
import { useState } from "react";
import LogoutButton from "@/app/components/LogoutButton";
import { useAuthentication } from "@/hooks/useAuthentication";
import { usePrivy } from "@privy-io/react-auth";

export default function HeyYo() {
  const { exportWallet } = usePrivy();
  const { authenticated, user, wallets } = useAuthentication();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      {!authenticated && <LoginButton />}

      {authenticated && (
        <div className="pt-4 pb-4">
          <BinderButton onClick={exportWallet}>Export Wallet</BinderButton>
        </div>
      )}

      {authenticated && <LogoutButton size="lg" withText />}
      {success && <div className="text-white text-xl">ETH SENT! 🎉</div>}
    </main>
  );
}
