import { createOrder, getOrders } from "@/utils/prisma";
import { NetworkStatus } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const status = request.nextUrl.searchParams.get("status") as
    | NetworkStatus
    | undefined;
  const orders = [];
  if (status) {
    orders.push(...(await getOrders(params.campaignId, status)));
  } else {
    orders.push(...(await getOrders(params.campaignId, "PENDING")));
    orders.push(...(await getOrders(params.campaignId, "CONFIRMED")));
  }
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  // Check and limit to only 3 orders per campaign
  const pendingOrders = await getOrders(data.campaignId, "PENDING");
  const confirmedOrders = await getOrders(data.campaignId, "CONFIRMED");
  if (pendingOrders.length + confirmedOrders.length === 3) {
    return NextResponse.json({
      error: "Campaign has reached the limit of 3 orders",
    });
  }
  const order = await createOrder(data);
  return NextResponse.json({ order });
}
