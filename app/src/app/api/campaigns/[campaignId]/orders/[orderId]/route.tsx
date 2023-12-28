import { deleteOrder, getOrder, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const order = await getOrder(params.orderId);
  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const data = await request.json();
  const order = await updateOrder(params.orderId, data);
  return NextResponse.json({ order });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const order = await deleteOrder(params.orderId);
  return NextResponse.json({ order });
}
