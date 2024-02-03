import getIframeData from "@/utils/getIframeData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { tokenId, collectionAddress } = await request.json();
  const r = await getIframeData({
    collectionAddress,
    tokenId,
  });
  return NextResponse.json({ data: r });
}
