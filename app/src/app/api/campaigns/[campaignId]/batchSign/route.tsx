import { NextResponse, type NextRequest } from "next/server";
import { keccak256, Wallet, getBytes, Signature, AbiCoder } from "ethers";
import { getCampaignWhiteList } from "@/utils/prisma";
import { TokenboundClient } from "@tokenbound/sdk";
import {
  ARTIST_COLLECTION_ADDRESS,
  ARTIST_WHITELIST_TOKEN_IDS,
} from "@/utils/common";
import crypto from "crypto";

function generateRandomBytes32() {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const data = await request.json();

  // // grab whitelist from campaign
  // // const campaignWhiteLists = await getCampaignWhiteList(params.campaignId);
  const { tokenMappings } = data as {
    tokenMappings: {
      contractAddress: string;
      tokenId: string;
      networkId: number;
    }[];
  };

  // // if (campaignWhiteLists.length > 0) {
  // if (networkId !== 1) {
  //   return NextResponse.json({ error: "Token not found in whitelist" });
  // }
  const recipients = [];
  for (const tokenMapping of tokenMappings) {
    if (
      ARTIST_COLLECTION_ADDRESS &&
      !ARTIST_COLLECTION_ADDRESS.includes(
        tokenMapping.contractAddress.toLowerCase()
      )
    ) {
      return NextResponse.json({ error: "Token not found in whitelist" });
    }
    if (
      ARTIST_WHITELIST_TOKEN_IDS &&
      !ARTIST_WHITELIST_TOKEN_IDS.includes(parseInt(tokenMapping.tokenId))
    ) {
      return NextResponse.json({ error: "Token not found in whitelist" });
    }

    const tokenboundClient = new TokenboundClient({
      chainId: tokenMapping.networkId,
    });
    recipients.push(
      await tokenboundClient.getAccount({
        tokenContract: tokenMapping.contractAddress as `0x${string}`,
        tokenId: tokenMapping.tokenId,
      })
    );
  }

  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("defined WALLET_PRIVATE_KEY in .env");
  }
  const nonce = generateRandomBytes32();
  const wallet = new Wallet(privateKey);
  const payloadHash = keccak256(
    new AbiCoder().encode(["address[]", "bytes32"], [recipients, nonce])
  );
  const signature = Signature.from(
    await wallet.signMessage(getBytes(payloadHash))
  ).serialized;
  return NextResponse.json({ signature, recipients, nonce, payloadHash });
}
