"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { StepProvider } from "@/context/StepsContext";
import { InstanceProvider } from "@/context/InstanceContext";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { configureChainsConfig } from "@/lib/wagmi";
import { ThemeProvider } from "@/components/theme-provider";
import APIHelpers from "@/lib/apiHelper";
import { blo } from "blo";
import { getENS } from "@/hooks/useAuthentication";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    throw new Error("privy app id not found in .env");
  }
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      onSuccess={async (user) => {
        // add user to db if not there
        let { user: authenticatedUser } = await APIHelpers.get(
          `/api/users/${user.id}?usePrivyId=true`
        );

        if (!authenticatedUser) {
          const walletAddress = user.wallet?.address;
          let imageUrl;
          if (walletAddress) {
            imageUrl = blo(`0x${walletAddress}`);
          }

          let nickname;
          // prioritize twitter username
          if (user.twitter?.username) {
            nickname = `@${user.twitter.username}`;
          } else {
            // Grab ens Names if has
            if (walletAddress) {
              const ensName = await getENS(walletAddress);
              if (!!ensName) {
                nickname = ensName;
              }
            }
          }

          const { user: createdUser } = await APIHelpers.post(`/api/users`, {
            body: {
              privyId: user.id,
              email: user.email,
              walletAddresses: [walletAddress],
              imageUrl,
              nickname,
              twitterUsername: user.twitter?.username,
              twitterSubject: user.twitter?.subject,
              twitterName: user.twitter?.name,
            },
          });
          user = createdUser;
        }
      }}
      config={{
        loginMethods: ["twitter", "wallet", "email"],
        appearance: {
          theme: "light",
          accentColor: "#458f68",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        <StepProvider>
          <InstanceProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
            <div vaul-drawer-wrapper="" className="">
              {children}
            </div>
            </ThemeProvider>
          </InstanceProvider>
        </StepProvider>
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}
