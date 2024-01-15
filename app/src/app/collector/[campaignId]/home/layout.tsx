"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useEffect } from "react";
import TopNav from "@/app/components/TopNav";

export default function CollectorsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { campaignId: string };
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated)
      router.push(`/collector/${params.campaignId}}`);
  }, [ready, authenticated, router, params.campaignId]);

  return (
    <main className="p-4">
      <TopNav />
      {children}
    </main>
  );
}
