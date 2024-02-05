import { NextResponse, type NextRequest } from "next/server";
import { keccak256, Wallet, getBytes, Signature, AbiCoder } from "ethers";
import { getCampaignWhiteList } from "@/utils/prisma";
import { TokenboundClient } from "@tokenbound/sdk";
import {
  ARTIST_COLLECTION_ADDRESS,
  ARTIST_WHITELIST_TOKEN_IDS,
} from "@/utils/common";

export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const data = await request.json();

  // grab whitelist from campaign
  // const campaignWhiteLists = await getCampaignWhiteList(params.campaignId);
  const { networkId, tokenId, contractAddress } = data;
  // if (campaignWhiteLists.length > 0) {
  if (networkId !== 1) {
    return NextResponse.json({ error: "Token not found in whitelist" });
  }
  if (
    ARTIST_COLLECTION_ADDRESS &&
    !ARTIST_COLLECTION_ADDRESS.includes(contractAddress.toLowerCase())
  ) {
    return NextResponse.json({ error: "Token not found in whitelist" });
  }
  if (
    ARTIST_WHITELIST_TOKEN_IDS &&
    !ARTIST_WHITELIST_TOKEN_IDS.includes(parseInt(tokenId))
  ) {
    return NextResponse.json({ error: "Token not found in whitelist" });
  }
  // const validToken = campaignWhiteLists.find((whitelist: any) =>
  //   whitelist.tokenId.length
  //     ? whitelist.contractAddress === contractAddress &&
  //       whitelist.tokenId === tokenId
  //     : whitelist.contractAddress === contractAddress
  // );
  // if (!validToken) {
  //   return NextResponse.json({ error: "Token not found in whitelist" });
  // }
  // }

  const tokenboundClient = new TokenboundClient({
    chainId: networkId,
  });
  const recipient = await tokenboundClient.getAccount({
    tokenContract: contractAddress as `0x${string}`,
    tokenId: tokenId,
  });

  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("defined WALLET_PRIVATE_KEY in .env");
  }
  const wallet = new Wallet(privateKey);
  const signature = Signature.from(
    await wallet.signMessage(
      getBytes(keccak256(new AbiCoder().encode(["address"], [recipient])))
    )
  ).serialized;
  return NextResponse.json({ signature, recipient });
}
