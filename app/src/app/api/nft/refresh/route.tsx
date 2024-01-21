import { networkToName } from "@/lib/utils";
import { getProvider } from "@/utils/common";
import { createNft } from "@/utils/prisma";
import { Network } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { ethers } from "ethers";
import { BINDER_DROP_ABI } from "@/abi";

export async function POST(request: NextRequest) {
  const { networkId, contractAddress, tokenId } = await request.json();
  // first grab tokenURI from the blockchain
  const provider = getProvider(networkId);
  const binderContract = new ethers.Contract(
    contractAddress,
    BINDER_DROP_ABI,
    provider
  );
  const uri = await binderContract.tokenURI(tokenId);
  if (!uri) {
    return NextResponse.json({ nft: undefined });
  }
  const nft = await createNft({
    contractAddress: contractAddress.toLowerCase(),
    tokenId,
    networkId: networkToName(Number(networkId)).toUpperCase() as Network,
    tokenUri: uri,
  });
  return NextResponse.json({ nft });
}
