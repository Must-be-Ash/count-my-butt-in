import APIHelpers from "@/lib/apiHelper";
import { User } from "@prisma/client";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { blo } from "blo";
import { getAlchemy } from "@/lib/alchemy";

/*
 * note: the return object contain `user` which is the user returned from privy
 * and `authenticatedUser` which is the user returned from our database
 */
export function useAuthentication() {
  const privyData = usePrivy();
  const { wallets } = useWallets();
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

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

export async function getENS(walletAddress: string) {
  const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"; // END mainnet address
  const alchemy = getAlchemy(1);
  const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
    contractAddresses: [ensContractAddress],
  });
  const ensNames = nfts.ownedNfts
    .map((nft) => nft.title)
    .filter((name) => name.endsWith(".eth"));
  return ensNames.length ? ensNames[0] : undefined;
}
