import React, { useEffect, useState } from "react";
import NFTDisplay from "@/app/components/NftDisplay";
import Link from "next/link";
import { OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { getNftsForOwner } from "@/lib/alchemy";
import BinderButton from "@/app/components/BinderButton";
import Loader from "./Loader";
import {
  ARTIST_COLLECTION_ADDRESS,
  ARTIST_WHITELIST_TOKEN_IDS,
} from "@/utils/common";
export interface PageToKeyMapping {
  [address: string]: {
    [page: number]: string | null;
  };
}

const NFTFeedProfile = ({
  addresses,
  searchWord,
  unclickable,
  readOnly,
  onClickCallback,
  networkId,
}: {
  readOnly?: boolean;
  addresses: string[];
  searchWord?: string;
  unclickable?: boolean;
  onClickCallback?: (
    networkId: string,
    contractAddress: string,
    tokenId: string,
    nftUrl: string,
    name: string
  ) => void;
  networkId?: number;
}) => {
  const [ownedNfts, setOwnedNfts] = useState<
    (OwnedNft & { networkId: string })[]
  >([]);
  const [pageToKeysMapping, setPageToKeyMapping] = useState<PageToKeyMapping>(
    {}
  );
  const [filteredData, setFilteredData] = useState<
    (OwnedNft & { networkId: string })[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const theNetwork = 1;

  async function nextPage() {
    const isLastPage = Object.keys(pageToKeysMapping).every(
      (address) => pageToKeysMapping[address][currentPage] === null
    );
    if (isLastPage) return;
    setLoading(true);
    try {
      let alchemyNfts: (OwnedNft & { networkId: string })[] = [];

      let newPageToKeysMapping: PageToKeyMapping = { ...pageToKeysMapping };
      for (let i = 0; i < addresses.length; i++) {
        const currentMapping = pageToKeysMapping[addresses[i]];
        const currentNull = Object.keys(currentMapping).find(
          (value: string) => {
            return currentMapping[Number(value)] === null;
          }
        );

        if (currentNull && Number(currentNull) <= currentPage) {
          continue;
        }
        let nfts: any[] = [];
        const theNFT = await getNftsForOwner(
          theNetwork,
          addresses[i],
          pageToKeysMapping[addresses[i]][currentPage] || undefined,
          ARTIST_COLLECTION_ADDRESS ? [ARTIST_COLLECTION_ADDRESS] : undefined
        );
        nfts.push(theNFT);
        alchemyNfts.push(
          ...theNFT.ownedNfts
            .filter((ownedNFT) =>
              ARTIST_WHITELIST_TOKEN_IDS
              // @ts-ignore
                ? ARTIST_WHITELIST_TOKEN_IDS.includes(Number(ownedNFT.tokenId))
                : true
            )
            .map((ownedNft) => ({
              ...ownedNft,
              networkId: theNetwork.toString(),
            }))
        );

        for (const nft of nfts) {
        }

        for (const nft of nfts) {
          if (nft.pageKey) {
            newPageToKeysMapping[addresses[i]] = {
              ...pageToKeysMapping[addresses[i]],
              [currentPage + 1]: nft.pageKey,
            };
          } else {
            newPageToKeysMapping[addresses[i]] = {
              ...pageToKeysMapping[addresses[i]],
              [currentPage + 1]: null,
            };
          }
        }
      }
      setPageToKeyMapping(newPageToKeysMapping);
      setCurrentPage(currentPage + 1);
      setOwnedNfts(alchemyNfts);
    } finally {
      setLoading(false);
    }
  }

  async function previousPage() {
    if (currentPage === 1) return;
    setLoading(true);
    try {
      let alchemyNfts: (OwnedNft & { networkId: string })[] = [];

      for (let i = 0; i < addresses.length; i++) {
        const currentMapping = pageToKeysMapping[addresses[i]];
        const currentNull = Object.keys(currentMapping).find(
          (value: string) => {
            return currentMapping[Number(value)] === null;
          }
        );
        if (Number(currentNull) < currentPage) {
          continue;
        }
        const nfts: OwnedNftsResponse[] = [];

        const theNFT = await getNftsForOwner(
          theNetwork,
          addresses[i],
          currentPage > 2
            ? pageToKeysMapping[addresses[i]][currentPage - 2] || undefined
            : undefined,
          ARTIST_COLLECTION_ADDRESS ? [ARTIST_COLLECTION_ADDRESS] : undefined
        );
        nfts.push(theNFT);
        alchemyNfts.push(
          ...theNFT.ownedNfts
            .filter((ownedNFT) =>
              ARTIST_WHITELIST_TOKEN_IDS
                ? ARTIST_WHITELIST_TOKEN_IDS.includes(Number(ownedNFT.tokenId))
                : true
            )
            .map((ownedNft) => ({
              ...ownedNft,
              networkId: theNetwork.toString(),
            }))
        );
      }
      if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
      }

      setOwnedNfts(alchemyNfts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function getNfts() {
      setLoading(true);
      try {
        let alchemyNfts: (OwnedNft & { networkId: string })[] = [];
        let pageToKeyMapping: PageToKeyMapping = {};

        if (!addresses.length) {
          return;
        }

        for (let i = 0; i < addresses.length; i++) {
          const nfts = [];
          if (unclickable) {
            return;
          }

          const theNFT = await getNftsForOwner(
            theNetwork,
            addresses[i],
            undefined,
            ARTIST_COLLECTION_ADDRESS ? [ARTIST_COLLECTION_ADDRESS] : undefined
          );
          nfts.push(theNFT);
          alchemyNfts.push(
            ...theNFT.ownedNfts
              .filter((ownedNFT) =>
                ARTIST_WHITELIST_TOKEN_IDS
                  ? ARTIST_WHITELIST_TOKEN_IDS.includes(
                      Number(ownedNFT.tokenId)
                    )
                  : true
              )
              .map((ownedNft) => ({
                ...ownedNft,
                networkId: theNetwork.toString(),
              }))
          );

          for (const nft of nfts) {
            pageToKeyMapping[addresses[i]] = {
              1: nft.pageKey!,
            };
          }
        }
        setPageToKeyMapping(pageToKeyMapping);
        setOwnedNfts(alchemyNfts);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    getNfts();
  }, [addresses, theNetwork, unclickable]);

  useEffect(() => {
    if (ownedNfts.length && searchWord) {
      const filteredNfts = ownedNfts.filter((nft: OwnedNft) => {
        return (
          nft?.title?.toLowerCase().includes(searchWord.toLowerCase()) ||
          nft?.rawMetadata?.name
            ?.toString()
            ?.toLowerCase()
            .includes(searchWord.toLowerCase()) ||
          nft?.contract.name?.toLowerCase().includes(searchWord.toLowerCase())
        );
      });

      setFilteredData(filteredNfts);
    } else {
      setFilteredData(ownedNfts);
    }
  }, [searchWord, ownedNfts]);

  // Calculate the start and end indices for slicing the images array
  return (
    <div>
      {!loading && filteredData.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {filteredData
              .filter(
                (nft: OwnedNft & { networkId: string }) => nft.media.length > 0
              )
              .map((nft: OwnedNft & { networkId: string }, index: number) => (
                <div key={`${nft.title}-${index}-${nft.tokenId}`}>
                  {!unclickable && !readOnly && (
                    <>
                      {!!onClickCallback ? (
                        <div
                          onClick={() => {
                            onClickCallback(
                              nft.networkId,
                              nft.contract.address,
                              nft.tokenId,
                              nft?.media[0].thumbnail ||
                                nft?.media[0].gateway ||
                                nft?.media[0].raw,
                              nft.title ||
                                nft?.rawMetadata?.name ||
                                nft.contract.name ||
                                "Unamed"
                            );
                          }}
                          className="cursor-pointer hover:opacity-80"
                        >
                          <NFTDisplay
                            imageUrl={
                              nft?.media[0].thumbnail ||
                              nft?.media[0].gateway ||
                              nft?.media[0].raw
                            }
                            title={nft.title}
                            tokenId={nft.tokenId}
                            networkId={Number(nft.networkId)}
                          />
                        </div>
                      ) : (
                        <Link
                          href={{
                            pathname: "/home/nftProfile",
                            query: {
                              contractAddress: nft.contract.address,
                              tokenId: nft.tokenId,
                              networkId: nft.networkId,
                            },
                          }}
                        >
                          <NFTDisplay
                            imageUrl={
                              nft?.media[0].thumbnail ||
                              nft?.media[0].gateway ||
                              nft?.media[0].raw
                            }
                            title={nft.title}
                            tokenId={nft.tokenId}
                            networkId={Number(nft.networkId)}
                          />
                        </Link>
                      )}
                    </>
                  )}
                  {(unclickable || readOnly) && (
                    <NFTDisplay
                      imageUrl={
                        nft?.media[0].thumbnail ||
                        nft?.media[0].gateway ||
                        nft?.media[0].raw
                      }
                      title={nft.title}
                      tokenId={nft.tokenId}
                      networkId={Number(nft.networkId)}
                    />
                  )}
                </div>
              ))}
          </div>

          <div className="flex justify-end mr-4 mt-4">
            {currentPage !== 1 && (
              <BinderButton onClick={() => previousPage()}>
                Previous
              </BinderButton>
            )}
            {!Object.keys(pageToKeysMapping).every(
              (address) => pageToKeysMapping[address][currentPage] === null
            ) && <BinderButton onClick={() => nextPage()}>Next</BinderButton>}
          </div>
        </>
      )}
      {loading && (
        <div className="flex flex-row justify-center items-center">
          <Loader />
        </div>
      )}
      {error && <ErrorDisplay error={error} />}
    </div>
  );
};

export default NFTFeedProfile;
