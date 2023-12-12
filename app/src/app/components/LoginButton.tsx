"use client";

import { usePrivy } from "@privy-io/react-auth";
import BinderButton from "@/app/components/binderButton";

export default function LoginButton() {
  const { login } = usePrivy();
  return <BinderButton primary={true} title="Log in" onClick={login} />;
}
