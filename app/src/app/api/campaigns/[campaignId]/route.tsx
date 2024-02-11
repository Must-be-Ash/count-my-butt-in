import { getCampaign, getUser, updateCampaign } from "@/utils/prisma";
import { Campaign, User } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const includeUser = request.nextUrl.searchParams.get("includeUser");
  const campaign = await getCampaign(params.campaignId);
  if (includeUser) {
    const user = await getUser(campaign.userId);
    campaign.user = user;
  }

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
