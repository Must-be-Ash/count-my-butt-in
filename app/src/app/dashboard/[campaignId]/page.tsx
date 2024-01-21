"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import BigLoginDisplayPage from "@/app/components/BigLoginDisplayPage";

export default function Dashboard({
  params,
}: {
  params: { campaignId: string };
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push(`/dashboard/${params.campaignId}/orders`);
    }
  }, [ready, authenticated, router, params.campaignId]);

  return (<BigLoginDisplayPage />);
}
