"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BigLoginDisplayPage from "@/app/components/BigLoginDisplayPage";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function Dashboard({ params }: { params: { campaignId: string } }) {
  const { ready, authenticated, authenticatedUser } = useAuthentication();
  const router = useRouter();
  console.log({authenticatedUser});
  useEffect(() => {
    if (ready && authenticated && authenticatedUser && authenticatedUser.campaign && authenticatedUser.campaign.campaignId) {
      router.push(`/dashboard/${authenticatedUser.campaign.campaignId}/orders`);
    }
  }, [ready, authenticated, router, params.campaignId, authenticatedUser]);

  return <BigLoginDisplayPage />;
}
