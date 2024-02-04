import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthentication } from "@/hooks/useAuthentication";

type Props = {
  homeRoute: string;
  children: ReactNode;
};

export const AuthenticatedPage: React.FC<Props> = ({
  homeRoute,
  children,
}: Props) => {
  const { ready, authenticated } = useAuthentication();
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (ready && !authenticated && pathName !== homeRoute) {
      router.push(homeRoute);
    }
  }, [homeRoute, router, pathName, ready, authenticated]);

  return <main>{children}</main>;
};
