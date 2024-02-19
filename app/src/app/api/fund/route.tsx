import { NextResponse, type NextRequest } from "next/server";

import { getProvider } from "@/utils/common";
import { formatEther, parseUnits } from "ethers";

import { Wallet } from "ethers";
import { getOrders } from "@/utils/prisma";

export async function POST(request: NextRequest) {
  const { receiverAddress, networkId, campaignId } = await request.json();
  // double check if there are ongoing orders in this campaign
  const orders = await getOrders(campaignId, "PENDING");
  if (!orders.length) {
    return NextResponse.json({
      success: false,
      message: "No pending orders",
    });
  }
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
