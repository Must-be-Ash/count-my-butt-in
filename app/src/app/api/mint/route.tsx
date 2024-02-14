import { NextResponse, type NextRequest } from "next/server";
import { Wallet, Interface } from "ethers";
import { BINDER_DROP_ABI } from "@/abi";
import { ethers } from "ethers";
import { getProvider } from "@/utils/common";
import { getCampaign } from "@/utils/prisma";
import { Campaign } from "@prisma/client";

export async function POST(request: NextRequest) {
  const { networkId, campaignId, orderId, recipient, signature } =
    await request.json();

  // grab and check campaign
  const campaign: Campaign = await getCampaign(campaignId);
  if (!campaign.binderContract) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 400 });
  }
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("defined WALLET_PRIVATE_KEY in .env");
  }
  const provider = getProvider(networkId);
  const wallet = new Wallet(privateKey, provider);

  const binderContract = new ethers.Contract(
    campaign.binderContract,
    BINDER_DROP_ABI,
    wallet
  );

  // trigger mint function
  try {
    const tx = await binderContract.mintTo(orderId, recipient, signature);
    const receipt = await tx.wait();



    const iface = new Interface(BINDER_DROP_ABI);
    let parsed;
    for (const log of receipt.logs) {
      try {
        parsed = iface.parseLog(log);
      } catch (e) {
        console.log(e);
      }
    }

    if (parsed?.args?.tokenId) {
      const tokenId = parsed?.args?.tokenId;
      return NextResponse.json({ tokenId: tokenId.toString() });
    }
  } catch (e) {
    console.log(JSON.stringify(e));
    console.error(`Mint failed`);
    console.error(e);
  }

  return NextResponse.json(
    { error: `Mint failed. Please try again or contact Ash at 587-699-6999` },
    { status: 400 }
  );
}
