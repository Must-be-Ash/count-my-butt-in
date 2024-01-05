import { NextResponse, type NextRequest } from "next/server";
import { ethers } from "ethers";
import { keccak256 } from "ethers";
import { solidityPacked } from "ethers";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { recipient, tokenId } = data;

  const privateKey = process.env.WALLET_PRIVATE_KEY;

  const wallet = new ethers.Wallet(privateKey!);
  const hash = keccak256(
    solidityPacked(["address", "uint256"], [recipient, tokenId])
  );

  const signature = await wallet.signMessage(hash);
  return NextResponse.json({ signature });
}
