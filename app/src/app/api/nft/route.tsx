import { networkToName } from "@/lib/utils";
import { createNft, getNft } from "@/utils/prisma";
import { Network } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenId = searchParams?.get("tokenId");
  const contractAddress = searchParams?.get("contractAddress");
  const networkId: string | null = searchParams?.get("networkId");

  if (!networkId || !tokenId || !contractAddress) {
    return NextResponse.json({ error: "Missing info" });
  }
  const network = networkToName(Number(networkId)).toUpperCase() as Network;
  const nft = await getNft(network, contractAddress, tokenId);
  return NextResponse.json({ nft });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const nft = await createNft(data);
  return NextResponse.json({ nft });
}
