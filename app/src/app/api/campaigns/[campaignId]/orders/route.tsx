import { createOrder, getOrders, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const orders = await getOrders(params.campaignId, "PENDING");
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const order = await createOrder(data);
  return NextResponse.json({ order });
}
