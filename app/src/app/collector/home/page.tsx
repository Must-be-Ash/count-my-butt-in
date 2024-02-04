"use client";

import Main from "@/app/layouts/Main";
import { AuthenticatedPage } from "@/app/components/page/AuthenticatedPage";
import OrdersList from "@/app/components/collectors/OrdersList";
import { useAuthentication } from "@/hooks/useAuthentication";
import Loader from "@/app/components/Loader";

export default function Collector({
  params,
}: {
  params: { campaignId: string };
}) {
  const { user } = useAuthentication();
  return (
    <AuthenticatedPage homeRoute={`/collector`}>
      <Main>
        <h1 className="text-2xl mb-10">Your Orders</h1>
        {user ? <OrdersList privyUserId={user.id} /> : <Loader />}
      </Main>
    </AuthenticatedPage>
  );
}
