import { Network, Alchemy, NftFilters, NftOrdering } from "alchemy-sdk";
import APIHelpers from "./apiHelper";

export const mainnetAlchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET!, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
});

export const goerliAlchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI!, // Replace with your Alchemy API Key.
  network: Network.ETH_GOERLI, // Replace with your network.
});

export const polygonAlchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON!, // Replace with your Alchemy API Key.
  network: Network.MATIC_MAINNET, // Replace with your network.
});

export const baseAlchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_BASE!, // Replace with your Alchemy API Key.
  network: Network.OPT_MAINNET, // Replace with your network.
});

export const optimismAlchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!, // Replace with your Alchemy API Key.
  network: Network.OPT_MAINNET, // Replace with your network.
});

export const sepoliaAlchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!, // Replace with your Alchemy API Key.
  network: Network.ETH_SEPOLIA, // Replace with your network.
});

export const nftsPerPage = 40;

export function getAlchemy(networkId: number) {
  if (networkId === 1) {
    return mainnetAlchemy;
  }
  if (networkId === 5) {
    return goerliAlchemy;
  }
  if (networkId === 137) {
    return polygonAlchemy;
  }
  if (networkId === 10) {
    return optimismAlchemy;
  }
  if (networkId === 8453) {
    return baseAlchemy;
  }
  if (networkId === 11155111) {
    return sepoliaAlchemy;
  }
  return mainnetAlchemy;
}

export function getNftMetadata(
  networkId: number,
  contractAddress: string,
  tokenId: string
) {
  const alchemy = getAlchemy(networkId);
  return alchemy.nft.getNftMetadata(contractAddress, tokenId);
}

export async function getNftsForOwner(
  networkId: number,
  address: string,
  pageKey?: string
) {
  const alchemy = getAlchemy(networkId);
  const ownedNfts = await alchemy.nft.getNftsForOwner(address, {
    pageKey,
    orderBy: NftOrdering.TRANSFERTIME,
    pageSize: nftsPerPage,
  });
  for (let i = 0; i < ownedNfts.ownedNfts.length; i++) {
    const ownedNft = ownedNfts.ownedNfts[i];
    if (ownedNft.title !== "Binder Drop") {
      continue;
    }
    // we want to get our own cached data to not relying on cache data on alchemy api
    const { nft } = await APIHelpers.get(
      `/api/nft?networkId=${networkId}&contractAddress=${ownedNft.contract.address}&tokenId=${ownedNft.tokenId}`
    );

    if (!!nft) {
      try {
        if (nft.tokenUri.includes("ipfs")) {
          // resolve ipfs url
          const { metadata } = await APIHelpers.post(`/api/nft/ipfs`, {
            body: {
              ipfsUrl: nft.tokenUri,
            },
          });

          ownedNft.title = metadata.name;

          ownedNft.media[0].gateway = metadata.image;
        }
      } catch (e) {
        // non-blocking
        console.error(e);
      }
    }

    ownedNfts.ownedNfts[i] = ownedNft;
  }

  return ownedNfts;
}

export function getNFTsForContract(
  networkId: number,
  contractAddress: string,
  pageKey?: string
) {
  const alchemy = getAlchemy(networkId);
  return alchemy.nft.getNftsForContract(contractAddress, {
    pageKey,
    pageSize: nftsPerPage,
  });
}
