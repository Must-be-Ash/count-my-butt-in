import { getUser, getUserByPrivyId, updateUser } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

/*
 * @queryParam {string} usePrivyId - userId will be the privyUserId instead of the prisma generated id from User model
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const usePrivyId = request.nextUrl.searchParams.get("usePrivyId");

  const user =
    usePrivyId && usePrivyId === "true"
      ? await getUserByPrivyId(params.userId)
      : await getUser(params.userId);

  return NextResponse.json({ user });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const data = await request.json();
  const user = await updateUser(params.userId, data);
  return NextResponse.json({ user });
}
