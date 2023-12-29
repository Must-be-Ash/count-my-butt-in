import { getOrder, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { ethers } from "ethers";
import { BINDER_DROP_ABI } from "@/abi";
import {
  BINDER_CONTRACT,
  SUPPORTED_NETWORKS,
  getProvider,
} from "@/utils/common";
import { EventLog } from "ethers";
import { networkToName } from "@/lib/utils";
import { Network } from "@prisma/client";

export async function POST(request: NextRequest) {
  const data = await request.json();

  for (const network of SUPPORTED_NETWORKS) {
    const provider = getProvider(network);
    // scan the latest 1000 blocks if fromblock and toblock is not specified
    const toBlock = data.toBlock || (await provider.getBlockNumber());
    const fromBlock = data.fromBlock || toBlock - 1000;

    const binderContract = new ethers.Contract(
      BINDER_CONTRACT,
      BINDER_DROP_ABI,
      provider
    );
    const binderMint = binderContract.filters.Mint();
    const logsBinderMint = await binderContract.queryFilter(
      binderMint,
      fromBlock,
      toBlock
    );
    const binderDataMints = logsBinderMint
      .filter((log) => Boolean(log))
      .map((log) => {
        const theLog = log as EventLog;
        return {
          orderId: theLog.args![0].toLowerCase(),
          tokenId: theLog.args![1].toString(),
          block: log.blockNumber,
          tx: log.transactionHash,
          getTransaction: log.getTransaction,
          log,
        };
      });
    for (const binderDataMint of binderDataMints) {
      const { orderId, tokenId, block, tx } = binderDataMint;
      // grab orderId and update data
      const order = await getOrder(orderId);
      if (!order?.transactionId) {
        await updateOrder(orderId, {
          transactionId: tx,
          mintedTokenId: tokenId,
          mintedNetworkId: networkToName(network).toUpperCase() as Network,
          status: "CONFIRMED",
        });
      }
    }
  }

  return NextResponse.json({ success: true });
}
