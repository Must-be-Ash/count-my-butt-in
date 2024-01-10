import { NextResponse, type NextRequest } from "next/server";
import { keccak256, Wallet, getBytes, Signature, AbiCoder } from "ethers";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { recipient } = data;
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("defined WALLET_PRIVATE_KEY in .env");
  }
  const wallet = new Wallet(privateKey);
  const signature = Signature.from(
    await wallet.signMessage(
      getBytes(keccak256(new AbiCoder().encode(["address"], [recipient])))
    )
  ).serialized;
  return NextResponse.json({ signature });
}
