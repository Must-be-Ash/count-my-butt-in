import { createCampaign } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const campaign = await createCampaign(data);
  return NextResponse.json({ campaign });
}
