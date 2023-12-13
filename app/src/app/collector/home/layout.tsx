"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/loader";
import { useEffect } from "react";
import TopNav from "@/app/components/topNav";

export default function CollectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) router.push("/collector");
  }, [ready, authenticated, router]);

  return (
    <main>
      <TopNav />
      {children}
    </main>
  );
}
