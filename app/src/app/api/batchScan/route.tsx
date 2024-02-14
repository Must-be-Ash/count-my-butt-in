import { getOrder, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { ethers } from "ethers";
import { BINDER_DROP_ABI } from "@/abi";
import { getProvider } from "@/utils/common";
import { EventLog } from "ethers";
import { networkToName } from "@/lib/utils";
import { Network, NetworkStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { fromBlock, toBlock, contractAddress, networkId } = data;
  const provider = getProvider(networkId);

  // scan the latest 1000 blocks if fromblock and toblock is not specified
  const toBlockForFilter = toBlock || (await provider.getBlockNumber());
  const fromBlockForFilter = fromBlock ?? toBlockForFilter - 500;

  const binderContract = new ethers.Contract(
    contractAddress,
    BINDER_DROP_ABI,
    provider
  );

  // Look for AutograhIncoming event
  const binderMint = binderContract.filters.AutographBatchCreated();

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
        orderIds: theLog.args![1],
        recipients: theLog.args![2],
        tokenId: theLog.args![3].toString(),
        block: log.blockNumber,
        tx: log.transactionHash,
        getTransaction: log.getTransaction,
        log,
      };
    });

  for (const binderDataMint of binderDataMints) {
    const { orderIds, recipients, tokenId, block, tx } = binderDataMint; // Note tokenId here is the max tokenId from the batch
    // grab orderId and update data
    for (let i = 0; i < orderIds.length; i++) {
      const theTokenId = Number(tokenId) - orderIds.length + i + 1;
      const order = await getOrder(orderIds[i]);
      if (!order?.transactionId) {
        await updateOrder(orderIds[i], {
          transactionId: `${tx}`,
          mintedTokenId: theTokenId.toString(),
          mintedContractAddress: contractAddress.toLowerCase(),
          mintedNetworkId: networkToName(networkId).toUpperCase() as Network,
          status: NetworkStatus.PENDING,
        });
      }
    }
  }
  return NextResponse.json({ success: true });
}
