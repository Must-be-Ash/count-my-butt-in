import { NextResponse, type NextRequest } from "next/server";

import { getProvider } from "@/utils/common";
import { formatEther, parseUnits } from "ethers";

import { Wallet } from "ethers";

export async function POST(request: NextRequest) {
  const { receiverAddress, networkId } = await request.json();
  // check current balance, only fund if balance is low
  const balance = await getProvider(networkId || 11155111).getBalance(
    receiverAddress
  );
  const balanceInEther = formatEther(balance);
  if (parseFloat(balanceInEther) > 0.00094) {
    return NextResponse.json({
      success: true,
      message: "Balance is sufficient",
    });
  }
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  const provider = getProvider(networkId || 11155111);
  const wallet = new Wallet(privateKey!, provider);

  // Send a transaction
  await wallet.sendTransaction({
    to: receiverAddress,
    value: parseUnits("0.00094", "ether"),
  });
  return NextResponse.json({ success: true });
}
