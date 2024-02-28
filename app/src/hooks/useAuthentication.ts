import APIHelpers from "@/lib/apiHelper";
import { Campaign, User } from "@prisma/client";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { getAlchemy } from "@/lib/alchemy";

/*
 * note: the return object contain `user` which is the user returned from privy
 * and `authenticatedUser` which is the user returned from our database
 */
export function useAuthentication() {
  const privyData = usePrivy();
  const { wallets } = useWallets();
  const [authenticatedUser, setAuthenticatedUser] = useState<
    User & {
      campaign: Campaign;
    }
  >();

  async function refreshUser() {
    if (!!privyData.user) {
      let { user } = await APIHelpers.get(
        `/api/users/${privyData.user.id}?usePrivyId=true`
      );
      // if authenticated and no user, try fetching again, there could be a slight delay between creation of new user and fetching
      if (!user) {
        setTimeout(async () => {
          let { user } = await APIHelpers.get(
            `/api/users/${privyData.user!.id}?usePrivyId=true`
          );
          setAuthenticatedUser(user);
        }, 1000);
        return;
      }
      setAuthenticatedUser(user);
    }
  }

  // find or create user if not exist
  useEffect(() => {
    async function run() {
      refreshUser();
    }

    run();
  }, [privyData]);

  return {
    ...privyData,
    wallets,
    authenticatedUser,
    refreshUser,
  };
}
