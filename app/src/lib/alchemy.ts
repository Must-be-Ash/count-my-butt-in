import {
  Network,
  Alchemy,
  NftFilters,
  NftOrdering,
  Nft,
  OwnedNft,
} from "alchemy-sdk";
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
  network: Network.BASE_MAINNET, // Replace with your network.
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

export async function getNftMetadata(
  networkId: number,
  contractAddress: string,
  tokenId: string
) {
  const alchemy = getAlchemy(networkId);
  let nft = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
  return injectBinderMetadata(networkId, nft);
}

export async function getNftsForOwner(
  networkId: number,
  address: string,
  pageKey?: string,
  contractAddresses?: string[] // only query from these specific contractAddresses
) {
  const alchemy = getAlchemy(networkId);
  const ownedNfts = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: contractAddresses,
    pageKey,
    orderBy: NftOrdering.TRANSFERTIME,
    pageSize: nftsPerPage,
  });
  for (let i = 0; i < ownedNfts.ownedNfts.length; i++) {
    const ownedNft = ownedNfts.ownedNfts[i];
    ownedNfts.ownedNfts[i] = (await injectBinderMetadata(
      networkId,
      ownedNft
    )) as OwnedNft;
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

export async function injectBinderMetadata(
  networkId: number,
  nft: Nft | OwnedNft
): Promise<Nft | OwnedNft> {
  // we want to get our own cached data to not relying on cache data on alchemy api
  const { nft: binderNft } = await APIHelpers.get(
    `/api/nft?networkId=${networkId}&contractAddress=${nft.contract.address}&tokenId=${nft.tokenId}`
  );
  if (!!binderNft) {
    try {
      if (binderNft.tokenUri.includes("ipfs")) {
        // resolve ipfs url
        const { metadata } = await APIHelpers.post(`/api/nft/ipfs`, {
          body: {
            ipfsUrl: binderNft.tokenUri,
          },
        });
        nft.title = metadata.name;
        if (!nft.media?.length) {
          nft.media = [{ raw: "", gateway: metadata.image }];
        } else {
          nft.media[0].gateway = metadata.image;
        }
      }
    } catch (e) {
      // non-blocking
      console.error(e);
    }
  }
  return nft;
}
