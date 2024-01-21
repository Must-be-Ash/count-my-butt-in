import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ThreeDots } from "react-loader-spinner";
import { OwnedNft, OwnedNftsResponse } from "alchemy-sdk";
import ErrorDisplay from "@/app/components/ErrorDisplay";
import { getNftsForOwner } from "@/lib/alchemy";
import { getOpenseaLink } from "@/lib/utils";
import NFTDisplay from "../NftDisplay";
import BinderButton from "../BinderButton";
import APIHelpers from "@/lib/apiHelper";
import { Order } from "@prisma/client";
import { useCampaign } from "@/hooks/useCampaign";

export interface PageToKeyMapping {
  [address: string]: {
    [page: number]: string | null;
  };
}

const NFTFeed = ({
  addresses,
  searchWord,
  networkIds,
  unclickable,
  fullRes,
}: {
  addresses: string[];
  searchWord: string;
  networkIds: number[];
  unclickable?: boolean;
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
            for (const ownedNft of theNFT.ownedNfts) {
              if (ownedNft.title === "Binder Drop") {
                // binder drop, check if metadata is updated
                const { order } = await APIHelpers.get(
                  `/api/nft?tokenId=${ownedNft.tokenId}&contractAddress=${ownedNft.contract.address}`
                );

                if (order && order.metadataUrl) {
                  const response = await fetch(order.metadataUrl);
                  const metadata = await response.json();
                  ownedNft.title = metadata.name;
                  const imageUrl = metadata.image.replaceAll(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  );
                  ownedNft.media[0].gateway = imageUrl;
                }
              }
            }
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
          <div className="grid grid-cols-4 gap-4 cursor-pointer">
            {filteredData
              .filter(
                (nft: OwnedNft & { networkId: string }) => nft.media.length > 0
              )
              .map((nft: OwnedNft & { networkId: string }, index: number) => (
                <div key={`${nft.title}-${index}`}>
                  {!unclickable && (
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
                          fullRes
                            ? nft?.media[0].gateway ||
                              nft?.media[0].thumbnail ||
                              nft?.media[0].raw
                            : nft?.media[0].thumbnail ||
                              nft?.media[0].gateway ||
                              nft?.media[0].raw
                        }
                        title={nft.title}
                        tokenId={nft.tokenId}
                        networkId={Number(nft.networkId)}
                      />
                    </Link>
                  )}
                  {unclickable && (
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
                        console.log("click");
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
                    />
                  )}
                </div>
              ))}
          </div>

          <div className="flex justify-end mr-4 mt-4 gap-4">
            {currentPage !== 1 && (
              <BinderButton
                className="bg-neural-800 text-neutral-300 px-4 py-2 rounded hover:cursor-pointer hover:text-neutral-100"
                onClick={() => previousPage()}
                title={"Previous"}
                primary={true}
              />
            )}
            {!Object.keys(pageToKeysMapping).every(
              (address) => pageToKeysMapping[address][currentPage] === null
            ) && (
              <BinderButton
                className="bg-neural-800 text-neutral-300 px-4 py-2 rounded hover:cursor-pointer hover:text-neutral-100"
                onClick={() => nextPage()}
                title={"Next"}
                primary={true}
              />
            )}
          </div>
        </>
      )}
      {/* {nft && !filteredData.length && (
        <div className='py-6'>
          <NewRequestButton onClick={onNewRequestClick} nft={nft} />
        </div>
      )} */}
      {loading && (
        <div className="flex flex-row justify-center items-center">
          <ThreeDots
            height="100"
            width="50"
            radius="9"
            color="#fffff"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      )}
      {error && <ErrorDisplay error={error} />}
    </div>
  );
};

export default NFTFeed;
