"use client";

import TopNav from "@/app/components/TopNav";
import Main from "@/app/layouts/Main";

export default function CollectorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Main hideNav>
      <TopNav />
      {children}
    </Main>
  );
}
