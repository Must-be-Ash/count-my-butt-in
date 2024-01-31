import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthentication } from "@/hooks/useAuthentication";
import LogoutButton from "@/app/components/LogoutButton";

type Props = {
  homeRoute: string;
  children: ReactNode;
  requiredUserId?: string;
};

export const AuthenticatedPage: React.FC<Props> = ({
  homeRoute,
  children,
  requiredUserId,
}: Props) => {
  const { ready, authenticated, authenticatedUser } = useAuthentication();
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    if (ready && !authenticated && pathName !== homeRoute) {
      router.push(homeRoute);
      return;
    }
  }, [homeRoute, router, pathName, ready, authenticated]);

  if (
    requiredUserId &&
    authenticatedUser &&
    requiredUserId !== authenticatedUser.id
  ) {
    return (
      <main>
        <div className="flex flex-col items-center mt-10">
          <LogoutButton />
          <div className="text-lg mt-10">
            Nice try dude but no access here, you lucky I didn't steal yo
            private key
          </div>
        </div>
      </main>
    );
  }
  return <main>{children}</main>;
};
