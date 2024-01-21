import { getOrderByToken } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenId = searchParams?.get("tokenId");
  const contractAddress = searchParams?.get("contractAddress");
  if (tokenId && contractAddress) {
    const orders = await getOrderByToken(tokenId, contractAddress);

    return NextResponse.json({
      order: orders.length > 0 ? orders[0] : undefined,
    });
  }
  return NextResponse.json({ order: undefined });
}
