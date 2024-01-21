"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useEffect } from "react";
import Main from "@/app/layouts/Main";

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
    <Main hideNav>
      {children}
    </Main>
  );
}
