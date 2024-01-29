import { getOrdersByPrivyUser, getOrdersByUser } from "@/utils/prisma";
import { Order } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Grab all orders of a specific user
 * @queryParam {string} usePrivyId - userId will be the privyUserId instead of the prisma generated id from User model
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const usePrivyId = request.nextUrl.searchParams.get("usePrivyId");
  let pendingOrders: Order[] = [];
  let confirmedOrders: Order[] = [];
  if (usePrivyId && usePrivyId === "true") {
    confirmedOrders = await getOrdersByPrivyUser(params.userId, "CONFIRMED");
    pendingOrders = await getOrdersByPrivyUser(params.userId, "PENDING");
  } else {
    confirmedOrders = await getOrdersByUser(params.userId, "CONFIRMED");
    pendingOrders = await getOrdersByUser(params.userId, "PENDING");
  }

  return NextResponse.json({ orders: [...pendingOrders, ...confirmedOrders] });
}
