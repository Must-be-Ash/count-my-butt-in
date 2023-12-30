import { getCampaign, updateCampaign } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const campaign = await getCampaign(params.campaignId);
  return NextResponse.json({ campaign });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const data = await request.json();
  const campaign = await updateCampaign(params.campaignId, data);
  return NextResponse.json({ campaign });
}
