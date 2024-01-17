import { NextResponse, type NextRequest } from "next/server";

import { getProvider } from "@/utils/common";
import { parseUnits } from "ethers";

import { Wallet } from "ethers";

export async function POST(request: NextRequest) {
  const { receiverAddress } = await request.json();
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  const provider = getProvider(11155111);
  const wallet = new Wallet(privateKey!, provider);

  // Send a transaction
  await wallet.sendTransaction({
    to: receiverAddress,
    value: parseUnits("0.05", "ether"),
  });
  return NextResponse.json({ success: true });
}
