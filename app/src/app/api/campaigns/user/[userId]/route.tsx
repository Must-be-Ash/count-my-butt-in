import { getCampaignsForUser } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const campaigns = await getCampaignsForUser(params.userId);
  return NextResponse.json({ campaigns });
}