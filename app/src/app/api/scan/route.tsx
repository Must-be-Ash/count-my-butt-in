import { getOrder, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { ethers } from "ethers";
import { BINDER_DROP_ABI } from "@/abi";
import { SUPPORTED_NETWORKS, getProvider } from "@/utils/common";
import { EventLog } from "ethers";
import { networkToName } from "@/lib/utils";
import { Network, NetworkStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { fromBlock, toBlock, contractAddress, networkId } = data;
  const provider = getProvider(networkId);
  // scan the latest 1000 blocks if fromblock and toblock is not specified
  const toBlockForFilter = toBlock || (await provider.getBlockNumber());
  const fromBlockForFilter = fromBlock || toBlock - 1000;

  const binderContract = new ethers.Contract(
    contractAddress,
    BINDER_DROP_ABI,
    provider
  );
  const binderMint = binderContract.filters.AutographIncoming();
  const logsBinderMint = await binderContract.queryFilter(
    binderMint,
    fromBlockForFilter,
    toBlockForFilter
  );
  const binderDataMints = logsBinderMint
    .filter((log) => Boolean(log))
    .map((log) => {
      const theLog = log as EventLog;
      return {
        orderId: theLog.args![1].toLowerCase(),
        recipient: theLog.args![2].toString(),
        tokenId: theLog.args![3].toString(),
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
        transactionId: `${tx}`,
        mintedTokenId: tokenId,
        mintedNetworkId: networkToName(networkId).toUpperCase() as Network,
        status: NetworkStatus.PENDING,
      });
    }
  }
  return NextResponse.json({ success: true });
}
