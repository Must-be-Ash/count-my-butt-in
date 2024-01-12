import { createOrder, getOrders, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const pendingOrders = await getOrders(params.campaignId, "PENDING");
  const confirmedOrders = await getOrders(params.campaignId, "CONFIRMED");
  return NextResponse.json({ orders: [...pendingOrders, ...confirmedOrders] });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const order = await createOrder(data);
  return NextResponse.json({ order });
}
