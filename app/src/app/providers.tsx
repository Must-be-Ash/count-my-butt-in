"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { StepProvider } from "@/context/StepsContext";
import { InstanceProvider } from "@/context/InstanceContext";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { configureChainsConfig } from "@/lib/wagmi";
import { ThemeProvider } from "@/components/theme-provider"



const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    throw new Error("privy app id not found in .env");
  }
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      onSuccess={(args) => {
        // add to db
        console.log("handle login here");
        console.log(args);
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
            {children}
            </ThemeProvider>
          </InstanceProvider>
        </StepProvider>
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}
