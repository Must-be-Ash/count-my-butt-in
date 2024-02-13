"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BigLoginDisplayPage from "@/app/components/BigLoginDisplayPage";
import { useAuthentication } from "@/hooks/useAuthentication";
import { DEFAULT_NETWORK } from "@/utils/common";

export default function Dashboard({ params }: { params: { campaignId: string } }) {
  return <BigLoginDisplayPage networkId={DEFAULT_NETWORK} />;
}
