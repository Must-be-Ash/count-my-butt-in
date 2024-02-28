import { getAlchemy } from "@/lib/alchemy";
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

export function getOpenseaCollectionLink(
  networkId: number,
  contractAddress: string
) {
  if (networkId === 1) {
    return `https://opensea.io/assets/ethereum/${contractAddress}`;
  }
  if (networkId === 137) {
    return `https://opensea.io/assets/matic/${contractAddress}`;
  }
  if (networkId === 8453) {
    return `https://opensea.io/assets/base/${contractAddress}`;
  }
  if (networkId === 10) {
    return `https://opensea.io/assets/optimism/${contractAddress}`;
  }
  if (networkId === 5) {
    return `https://testnets.opensea.io/assets/goerli/${contractAddress}`;
  }
  if (networkId === 11155111) {
    return `https://testnets.opensea.io/assets/sepolia/${contractAddress}`;
  }
  return `https://opensea.io/assets/ethereum/${contractAddress}`;
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

export function networkIdToString(networkId: number) {
  return `eip155:${networkId}`;
}

export const DEFAULT_NETWORK = 8453;

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
  `https://base-mainnet.blastapi.io/5d52166f-9250-40f7-8698-a7536f95a1ae`
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

// export const binderFactoryContract: Record<number, string> = {
//   [10]: "0x7e7d154dbad3853aeeef8a35e92044795ae56851",
//   [11155111]: "0xc9f8daf5a1d54f6f2b6cfb8049c10111ba8d69a1",
// };

export const BINDER_DROP_TOKEN = "0x9693ad9fe3fb08bab0a7491303a296da706837ad";

export const childrenNetworkIds = [1, 137, 8453, 11155111, 10];

export const defaultNote = "I am a busy collector";

export const ARTIST_COLLECTION_ADDRESS: string | undefined = undefined;

export const ARTIST_WHITELIST_TOKEN_IDS: number[] | undefined = undefined;

// export const DEFAULT_METADATA_URL =
//   "https://arweave.net/ckSld6yHJxWxis45HhUxOcaP23Ksym1rv1rcDrz8Z-E"; // CHANGE THIS IF U WANT TO CHANGE THE DEFAULT METADATA

// export const DEFAULT_METADATA = {
//   // DO NOT WORRY ABOUT THIS
//   created_by: "Binder Studio",
//   description: "Binder Signature Drop, Power by [Binder](https://signed.gg/)",
//   external_url: "https://signed.gg",
//   name: "Binder Drop",
//   image_details: {
//     bytes: 314183,
//     format: "PNG",
//     sha256: "6e072dffcd7dddbd8c5a4797d5ca25e6013363d1f899b22b5c01178e3d2c3853",
//     width: 4320,
//     height: 4320,
//   },
//   image: "https://arweave.net/qWfD01lnf6A9dWcNSxZ6ZCWSZ7CgVz5iq99j7QhHW6c",
//   image_url: "https://arweave.net/qWfD01lnf6A9dWcNSxZ6ZCWSZ7CgVz5iq99j7QhHW6c",
//   animation_details: {
//     bytes: 1636135,
//     format: "MP4",
//     duration: 11,
//     sha256: "2f10aab908e915631664eb0a7d5ae04afe85f31fb97bd59b09d676e75753bde0",
//     width: 1080,
//     height: 1080,
//     codecs: ["H.264", "AAC"],
//   },
//   animation: "https://arweave.net/aZBb0n-kqSh7eyNcxw4KhAyCBCcQyGO1GnWbV2e0Hcw",
//   animation_url:
//     "https://arweave.net/aZBb0n-kqSh7eyNcxw4KhAyCBCcQyGO1GnWbV2e0Hcw",
// };

export const serverPay = true;

export const PAYMENT_WALLET: Record<number, string> = {
  [1]: "0xb3485416bb361093188529bacd5551ac420013ab",
  [8453]: "0xb3485416bb361093188529bacd5551ac420013ab",
  [137]: "0xb3485416bb361093188529bacd5551ac420013ab",
  [10]: "0xb3485416bb361093188529bacd5551ac420013ab",
  [11155111]: "0xb3485416bb361093188529bacd5551ac420013ab",
};

export const dayNames = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];
export const monthNames = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const SUPPORTED_NETWORKS = [1, 137, 10, 8453];

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
