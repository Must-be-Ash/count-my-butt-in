"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BigLoginDisplayPage from "@/app/components/BigLoginDisplayPage";
import { useAuthentication } from "@/hooks/useAuthentication";
import { DEFAULT_NETWORK } from "@/utils/common";

export default function Dashboard({
  params,
}: {
  params: { campaignId: string };
}) {
  const { ready, authenticated } = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push(`/collector/home`);
    }
  }, [ready, authenticated, router, params.campaignId]);

  return <BigLoginDisplayPage networkId={DEFAULT_NETWORK} />;
}
