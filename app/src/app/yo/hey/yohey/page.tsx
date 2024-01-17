"use client";

import BinderButton from "@/app/components/BinderButton";
import LoginButton from "@/app/components/LoginButton";
import APIHelpers from "@/lib/apiHelper";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState } from "react";

export default function HeyYo() {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      {authenticated && (
        <BinderButton
          onClick={async () => {
            if (wallets.length) {
              console.log(`funding ${wallets[0].address}`);
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
          title="Fund Me"
          className="mb-10"
        />
      )}
      {!authenticated && <LoginButton />}
      {success && <div className="text-white text-xl">ETH SENT! 🎉</div>}
    </main>
  );
}
