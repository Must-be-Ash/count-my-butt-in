"use client";

import BinderButton from "@/app/components/BinderButton";
import LogoutButton from "./LogoutButton";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function LoginButton({
  title,
  className,
}: {
  title?: string;
  className?: any;
}) {
  const { login, authenticated } = useAuthentication();

  if (authenticated) {
    return <LogoutButton size="lg" withText className={className} />;
  }

  return (
    <BinderButton className={className} onClick={login}>
      {title || "Login"}
    </BinderButton>
  );
}
