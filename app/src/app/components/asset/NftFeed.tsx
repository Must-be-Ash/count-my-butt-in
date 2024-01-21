import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ThreeDots } from "react-loader-spinner";
import { OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { getNftsForOwner, nftsPerPage } from "@/lib/alchemy";
import { getOpenseaLink } from "@/lib/utils";
import NFTDisplay from "../NftDisplay";
import BinderButton from "../BinderButton";
import Loader from "../Loader";

export interface PageToKeyMapping {
  [address: string]: {
    [page: number]: string | null;
  };
}

// support paging for multiple TBA addresses
const NFTFeed = ({
  addresses,
  searchWord,
  networkIds,
  fullRes,
}: {
  addresses: string[];
  searchWord: string;
  networkIds: number[];
  fullRes?: boolean;
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
        for (const networkId of networkIds) {
          const theNFT = await getNftsForOwner(
            networkId,
            addresses[i],
            pageToKeysMapping[addresses[i]][currentPage] || undefined
          );
          nfts.push(theNFT);
          alchemyNfts.push(
            ...theNFT.ownedNfts.map((ownedNft) => ({
              ...ownedNft,
              networkId: networkId.toString(),
            }))
          );
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
        for (const networkId of networkIds) {
          const theNFT = await getNftsForOwner(
            networkId,
            addresses[i],
            currentPage > 2
              ? pageToKeysMapping[addresses[i]][currentPage - 2] || undefined
              : undefined
          );
          nfts.push(theNFT);
          alchemyNfts.push(
            ...theNFT.ownedNfts.map((ownedNft) => ({
              ...ownedNft,
              networkId: networkId.toString(),
            }))
          );
        }
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
    // pagination
    async function getNfts() {
      setLoading(true);
      try {
        let alchemyNfts: (OwnedNft & { networkId: string })[] = [];
        let pageToKeyMapping: PageToKeyMapping = {};
        for (let i = 0; i < addresses.length; i++) {
          const nfts = [];
          for (const networkId of networkIds) {
            const theNFT = await getNftsForOwner(networkId, addresses[i]);
            nfts.push(theNFT);
            alchemyNfts.push(
              ...theNFT.ownedNfts.map((ownedNft) => ({
                ...ownedNft,
                networkId: networkId.toString(),
              }))
            );
          }

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
  }, [addresses, networkIds]);

  useEffect(() => {
    // filter nft by searchWord
    if (ownedNfts.length && searchWord) {
      const filteredNfts = ownedNfts.filter((nft: OwnedNft) => {
        const nftName =
          nft?.title ||
          nft?.rawMetadata?.name?.toString() ||
          nft?.contract.name;
        return nftName?.toLowerCase().includes(searchWord.toLowerCase());
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 cursor-pointer w-full">
            {filteredData
              .filter(
                (nft: OwnedNft & { networkId: string }) => nft.media.length > 0
              )
              .map((nft: OwnedNft & { networkId: string }, index: number) => (
                <div key={`${nft.title}-${index}`}>
                  <NFTDisplay
                    imageUrl={
                      fullRes
                        ? nft?.media[0].gateway ||
                          nft?.media[0].thumbnail ||
                          nft?.media[0].raw
                        : nft?.media[0].thumbnail ||
                          nft?.media[0].gateway ||
                          nft?.media[0].raw
                    }
                    onClick={() => {
                      window.open(
                        getOpenseaLink(
                          Number(nft.networkId),
                          nft.contract.address,
                          nft.tokenId
                        )
                      );
                    }}
                    title={nft.title}
                    tokenId={nft.tokenId}
                    networkId={Number(nft.networkId)}
                    size="lg"
                  />
                </div>
              ))}
          </div>

          <div className="flex justify-end mr-4 mt-4 gap-4">
            {currentPage !== 1 && (
              <BinderButton onClick={() => previousPage()}>
                Previous
              </BinderButton>
            )}
            {!Object.keys(pageToKeysMapping).every(
              (address) =>
                pageToKeysMapping[address][currentPage] === null ||
                filteredData.length < nftsPerPage
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

export default NFTFeed;
