"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { StepProvider } from "@/context/StepsContext";
import { SelectedNftProvider } from "@/context/SelectedNftContext";
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
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
      }}
    >
      <StepProvider>
        <SelectedNftProvider>{children}</SelectedNftProvider>
      </StepProvider>
    </PrivyProvider>
  );
}
