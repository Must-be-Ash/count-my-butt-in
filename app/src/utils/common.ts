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
  if (networkId === 10) {
    return `https://opensea.io/assets/optimism/${contractAddress}/${tokenId}`;
  }
  if (networkId === 5) {
    return `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`;
  }
  if (networkId === 11155111) {
    return `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`;
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
  if (networkId === 10) {
    return `https://optimistic,etherscan.io/address/${contractAddress}`;
  }
  if (networkId === 5) {
    return `https://goerli.etherscan.io/address/${contractAddress}`;
  }
  if (networkId === 11155111) {
    return `https://sepolia.etherscan.io/address/${contractAddress}`;
  }
  if (networkId === 10) {
    return `https://optimism.etherscan.io/address/${contractAddress}`;
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
  if (networkId === 10) {
    return `https://tokenbound.org/assets/optimism/${contractAddress}/${tokenId}`;
  }
  if (networkId === 8453) {
    return `https://tokenbound.org/assets/base/${contractAddress}/${tokenId}`;
  }
  if (networkId === 5) {
    return `https://tokenbound.org/assets/goerli/${contractAddress}/${tokenId}`;
  }
  return `https://tokenbound.org/assets/ethereum/${contractAddress}/${tokenId}`;
}

export const NETWORK_ID = 10;

export function networkIdToString(networkId: number) {
  return `eip155:${networkId}`;
}

export const SUPPORTED_NETWORKS = [10];

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

export const sepoliaProvider = new JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA}`
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
  if (networkId === 11155111) {
    return sepoliaProvider;
  }
  return mainnetProvider;
}

export const MINT_FEE = 0.01;

export const binderNetworkId = 10;
export const binderFactoryContract =
  "0x7e7d154dbad3853aeeef8a35e92044795ae56851";

export const childrenNetworkIds = [1, 137, 8453, 11155111, 10];

export const defaultNote = "I am a busy collector";

export const ARTIST_COLLECTION_ADDRESS =
  "0xb2c7f411aa425d3fce42751e576a01b1ff150385";

export const ARTIST_WHITELIST_TOKEN_IDS = [
  1, 101, 44, 4, 8, 15, 13, 19, 60, 21, 53, 37, 131, 69, 55, 105, 107, 112, 115,
  71, 75, 79, 64, 118, 67, 86, 92, 93, 123, 144, 125, 146, 142, 192, 157, 171,
  172, 179, 183, 182, 206, 212, 210, 199, 222, 225, 231, 254, 242, 237, 256,
  252, 263, 267, 278, 285, 310, 301, 324, 333, 334, 339, 356, 358, 349, 369,
  386, 381, 384, 393, 432, 446, 440, 399, 400, 409, 425, 415, 449, 447, 448,
  459, 479, 489, 493, 496, 484, 502, 507, 509, 516, 537, 525, 524, 532, 536,
  569, 580, 585, 598, 588, 592, 610, 628, 631, 642, 649, 648, 655, 659, 661,
  663,
];

export const CAMPAIGN_NETWORK = "OPTIMISM";
