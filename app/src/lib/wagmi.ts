import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
// You can import additional chains from 'wagmi/chains'
// https://wagmi.sh/react/chains
import { mainnet, goerli, optimism, base } from "@wagmi/chains";
import { configureChains, sepolia } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
// You may replace this with your preferred providers
// https://wagmi.sh/react/providers/configuring-chains#multiple-providers
import { publicProvider } from "wagmi/providers/public";

// Replace the chains and providers with the ones used by your app.
// https://wagmi.sh/react/providers/configuring-chains
export const configureChainsConfig = configureChains(
  [mainnet, goerli, optimism, base, sepolia],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA! }),
  ]
);
