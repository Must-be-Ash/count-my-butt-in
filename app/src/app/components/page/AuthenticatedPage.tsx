import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

type Props = {
  homeRoute: string;
  children: ReactNode;
};

export const AuthenticatedPage: React.FC<Props> = ({
  homeRoute,
  children,
}: Props) => {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (ready && !authenticated && pathName !== homeRoute) {
      router.push(homeRoute);
    }
  }, [homeRoute, router, pathName, ready, authenticated]);

  return <main>{children}</main>;
};
