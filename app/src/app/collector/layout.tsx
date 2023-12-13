"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/loader";
import { useEffect } from "react";
import TopNav from "../components/topNav";

export default function CollectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) router.push("/collector/home");
  }, [ready, authenticated, router]);

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return <Loader />;
  }

  return (
    <main className="max-w-3xl flex flex-col items-center w-full mx-auto my-auto h-screen font-avenir">
      {children}
    </main>
  );
}
