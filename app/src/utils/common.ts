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
  if (networkId === 5) {
    return `https://goerli.etherscan.io/address/${contractAddress}`;
  }
  if (networkId === 11155111) {
    return `https://sepolia.etherscan.io/address/${contractAddress}`;
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

export const binderNetworkId = 11155111;
export const binderFactoryContract =
  "0xAF8A8d6823b4Ff069F6bC805cbD6675Bb4CEfa9f";

export const childrenNetworkIds = [1, 137, 8453, 11155111];

export const defaultNote = "I am a busy collector";

export const VIOLETTA_COLLECTION_ADDRESS =
  "0x70bE4E3761188d0a8c525E54bB81c4Ea97712de4";

export const VIOLETTA_WHITELIST_TOKEN_IDS = [
  5, 9, 45, 130, 150, 167, 169, 172, 192, 251, 253, 270, 278, 288, 293, 318,
  320, 351, 377, 389, 423, 445, 463, 545, 567, 593, 656, 680, 702, 709, 746,
  761, 776, 796, 800, 821, 825, 918, 932, 1010, 1104, 1126, 1136, 1147, 1163,
  1174, 1199, 1242, 1255, 1286, 1313, 1316, 1360, 1368, 1417, 1494, 1512, 1516,
  1579, 1581, 1631, 1649, 1679, 1711, 1729, 1752, 1760, 1788, 1791, 1794, 1801,
  1828, 1915, 1920, 1923, 1975, 2004, 2020, 2069, 2071, 2074, 2075, 2094, 2101,
  2210, 2212, 2244, 2312, 2330, 2337, 2414,
];
