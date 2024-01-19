"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Nft } from "alchemy-sdk";
import { TokenboundClient } from "@tokenbound/sdk";
import { getNftMetadata } from "@/lib/alchemy";
import Loader from "@/app/components/Loader";
import NFTFeed from "@/app/components/asset/NftFeed";
import { nameToNetwork } from "@/lib/utils";
import { getOpenseaLink } from "@/lib/utils";

export default function NFTProfile({
  params,
}: {
  params: {
    network: string;
    contractAddress: string;
    tokenId: string;
  };
}) {
  const [nft, setNFT] = useState<Nft>();
  const [tokenContracts, setTokenContracts] = useState<string[]>([]);
  const contractAddress = params.contractAddress;
  const tokenId = params.tokenId;
  const networkId = nameToNetwork(params.network);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (!networkId) {
    throw new Error("networkId is required");
  }

  useEffect(() => {
    if (contractAddress && tokenId) {
      getNftMetadata(Number(networkId), contractAddress, tokenId).then(
        (value: any) => {
          setNFT(value);
        }
      );
    }
  }, [contractAddress, tokenId, networkId]);

  useEffect(() => {
    async function getTokenBoundContract(
      contractAddress: string,
      tokenId: string,
      networkId: string
    ) {
      setTokenContracts([]);
      setIsLoading(true);
      try {
        let tokenAccounts: string[] = [];
        const tokenboundClient = new TokenboundClient({
          chainId: Number(networkId),
        });
        tokenAccounts.push(
          await tokenboundClient.getAccount({
            tokenContract: contractAddress as `0x${string}`,
            tokenId: tokenId,
          })
        );
        setTokenContracts(Array.from(new Set(tokenAccounts)));
      } finally {
        setIsLoading(false);
      }
    }

    if (contractAddress && tokenId) {
      getTokenBoundContract(contractAddress, tokenId, networkId.toString());
    }
  }, [contractAddress, tokenId, networkId]);

  return (
    <>
      <div className="">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {nft && (
              <>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-6 items-center">
                    <div className="relative w-36 h-36 rounded-md">
                      <Image
                        layout="fill"
                        className="inline-block rounded-md cursor-pointer"
                        onClick={() => {
                          window.open(
                            getOpenseaLink(
                              Number(networkId),
                              nft.contract.address,
                              nft.tokenId
                            )
                          );
                        }}
                        src={
                          nft?.media[0]?.thumbnail ||
                          nft?.media[0]?.gateway ||
                          nft?.media[0]?.raw
                        }
                        objectFit="cover"
                        alt=""
                      />
                    </div>

                    <div className="flex flex-col text-sm">
                      <div>{nft.title}</div>
                      <div>{nft.contract.name}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-10">
                  <div className="relative mb-12">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-neural-700 mt-10" />
                    </div>
                  </div>
                  <div></div>
                  {!isLoading && tokenContracts.length > 0 && (
                    <NFTFeed
                      addresses={tokenContracts}
                      searchWord=""
                      networkIds={[1, 137, 11155111, 8453]}
                      unclickable={true}
                      fullRes={true}
                    />
                  )}
                  {isLoading && <Loader />}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
