import { createOrUpdateUser } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const user = await createOrUpdateUser(data);
  return NextResponse.json({ user });
}
