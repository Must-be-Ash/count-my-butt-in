"use client"
import BinderMainLogo from "@/app/components/BinderMainLogo";
import LoginOrUserWidget from "../components/LoginOrUserWidget";
import Main from "@/app/layouts/Main";
import { SignaturePadTest } from "../components/SignaturePad/SignaturePad";
export default function Dashboard() {
  return (
    <Main>
      <BinderMainLogo />
      <LoginOrUserWidget />
      <SignaturePadTest />
    </Main>
  );
}
