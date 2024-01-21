"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useEffect } from "react";
import TopNav from "@/app/components/TopNav";
import Main from "@/app/layouts/Main";

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
    if (ready && !authenticated) router.push(`/collector/${params.campaignId}`);
  }, [ready, authenticated, router, params.campaignId]);

  return (
    <Main hideNav>
      <TopNav />
      {children}
    </Main>
  );
}
