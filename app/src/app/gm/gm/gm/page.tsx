"use client";

import BinderButton from "@/app/components/BinderButton";
import LoginButton from "@/app/components/LoginButton";
import APIHelpers from "@/lib/apiHelper";
import { useState } from "react";
import LogoutButton from "@/app/components/LogoutButton";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function HeyYo() {
  const { authenticated, user, wallets } = useAuthentication();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      {authenticated && (
        <BinderButton
          onClick={async () => {
            if (wallets.length) {
              setLoading(true);
              await APIHelpers.post("/api/fund", {
                body: {
                  receiverAddress: wallets[0].address,
                } as any,
              });
              setSuccess(true);
            }
            setLoading(false);
          }}
          isLoading={loading}
        >
          Fund me
        </BinderButton>
      )}
      {!authenticated && <LoginButton />}
      {authenticated && <LogoutButton size="lg" withText />}
      {success && <div className="text-white text-xl">ETH SENT! 🎉</div>}
    </main>
  );
}
