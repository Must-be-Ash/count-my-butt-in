"use client";
import BinderMainLogo from "@/app/components/BinderMainLogo";
import LoginOrUserWidget from "../../components/LoginOrUserWidget";
import Main from "@/app/layouts/Main";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

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

  return (
    <Main>
      <BinderMainLogo />
      <LoginOrUserWidget />
    </Main>
  );
}
