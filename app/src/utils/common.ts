import { JsonRpcProvider } from "ethers";

export function getOpenseaLink(
  networkId: number,
  contractAddress: string,
  tokenId: string
) {
  if (networkId === 1) {
    return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`;
  }
  if (networkId === 137) {
    return `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`;
  }
  if (networkId === 8453) {
    return `https://opensea.io/assets/base/${contractAddress}/${tokenId}`;
  }
  if (networkId === 5) {
    return `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`;
  }
  return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`;
}

export function getContractEtherscanLink(
  networkId: number,
  contractAddress: string
) {
  if (networkId === 1) {
    return `https://etherscan.io/address/${contractAddress}`;
  }
  if (networkId === 137) {
    return `https://polygonscan.com/address/${contractAddress}`;
  }
  if (networkId === 8453) {
    return `https://basescan.org/address/${contractAddress}`;
  }
  if (networkId === 5) {
    return `https://goerli.etherscan.io/address/${contractAddress}`;
  }
  return `https://etherscan.io/address/${contractAddress}`;
}

export function getTokenBoundLink(
  networkId: number,
  contractAddress: string,
  tokenId: string
) {
  if (networkId === 1) {
    return `https://tokenbound.org/assets/ethereum/${contractAddress}/${tokenId}`;
  }
  if (networkId === 137) {
    return `https://tokenbound.org/assets/matic/${contractAddress}/${tokenId}`;
  }
  if (networkId === 8453) {
    return `https://tokenbound.org/assets/base/${contractAddress}/${tokenId}`;
  }
  if (networkId === 5) {
    return `https://tokenbound.org/assets/goerli/${contractAddress}/${tokenId}`;
  }
  return `https://tokenbound.org/assets/ethereum/${contractAddress}/${tokenId}`;
}

export const NETWORK_ID = 5;

export function networkIdToString(networkId: number) {
  return `eip155:${networkId}`;
}

export const CAMPAIGN_ID = "1";

export const BINDER_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const SUPPORTED_NETWORKS = [5];

export const goerliProvider = new JsonRpcProvider(
  `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_GOERLI}`
);

export const mainnetProvider = new JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET}`
);

export const polygonProvider = new JsonRpcProvider(
  `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_POLYGON}`
);

export const optimismProvider = new JsonRpcProvider(
  `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM}`
);

export const baseProvider = new JsonRpcProvider(
  `https://base-mainnet.blastapi.io/${process.env.NEXT_PUBLIC_ALCHEMY_BASE}`
);

export function getProvider(networkId: number) {
  if (networkId === 1) {
    return mainnetProvider;
  }
  if (networkId === 5) {
    return goerliProvider;
  }
  if (networkId === 137) {
    return polygonProvider;
  }
  if (networkId === 10) {
    return optimismProvider;
  }
  if (networkId === 8453) {
    return baseProvider;
  }
  return mainnetProvider;
}
