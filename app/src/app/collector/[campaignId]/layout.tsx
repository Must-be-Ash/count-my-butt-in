"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useEffect } from "react";

export default function CollectorsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { campaignId: string };
}) {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated)
      router.push(`/collector/${params.campaignId}/home`);
  }, [ready, authenticated, router]);

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return (
      <Loader className="mx-auto flex flex-row justify-center items-center mt-20" />
    );
  }

  return (
    <main className="max-w-3xl flex flex-col items-center w-full mx-auto my-auto h-screen font-avenir">
      {children}
    </main>
  );
}