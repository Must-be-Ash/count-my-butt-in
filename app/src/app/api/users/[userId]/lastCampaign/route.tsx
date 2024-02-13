import { getLastCampaign } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const campaign = await getLastCampaign(params.userId);
  console.log({campaign});
  return NextResponse.json({ campaign });
}
