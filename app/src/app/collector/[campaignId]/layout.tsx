"use client";

import Loader from "@/app/components/Loader";
import Main from "@/app/layouts/Main";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function CollectorsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { campaignId: string };
}) {
  const { ready } = useAuthentication();

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return (
      <Loader className="mx-auto flex flex-row justify-center items-center mt-20" />
    );
  }

  return <Main hideNav>{children}</Main>;
}
