import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useWallets } from "@privy-io/react-auth";
import { networkIdToString } from "@/utils/common";
import { useEffect } from "react";
import { useWaitForTransaction } from "wagmi";
import { Interface } from "@ethersproject/abi";
import { parseEther } from "ethers";

export function useWrite(data: {
  networkId: number;
  contractAddress: string;
  abi: any;
  functionName: string;
  args: any[];
  tipAmount: number;
}) {
  const { contractAddress, abi, functionName, args, networkId, tipAmount } =
    data;

  const { wallets } = useWallets();
  const wallet = wallets[0];

  let error = null;

  // check if the user is connected to the correct network
  const wrongNetwork = wallet?.chainId !== networkIdToString(networkId);
  // Set error if user is on wrong network
  if (wrongNetwork) {
    error = {
      name: "Wrong Network",
      message: "Please connect to the correct network",
      networkId: wallet?.chainId,
    };
  }

  const {
    config,
    error: prepareError,
    isLoading,
  } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi,
    args,
    value: parseEther(tipAmount.toString()),
    functionName,
  });

  const {
    writeAsync: write,
    error: mintError,
    isLoading: isWriteLoading,
    data: writeData,
  } = useContractWrite(config);

  const {
    isLoading: isMintLoading,
    isSuccess,
    data: receipt,
    error: transactionError,
  } = useWaitForTransaction({
    hash: writeData?.hash,
  });

  error = error || prepareError || mintError;

  // prompt for network switch if user is on wrong network
  useEffect(() => {
    if (wrongNetwork && wallet) {
      wallet.switchChain(networkId);
    }
  }, [networkId, wallet, wrongNetwork]);

  let parsed;
  if (receipt) {
    const iface = new Interface(abi);
    for (const log of receipt.logs) {
      try {
        parsed = iface.parseLog(log);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return {
    write,
    error: error && formatError(error),
    transactionError,
    isLoading: isLoading || isWriteLoading || isMintLoading,
    data: writeData,
    currentNetwork: wallet?.chainId,
    wrongNetwork,
    switchCorrectNetwork: () => wallet.switchChain(networkId),
    isSuccess,
    wallet,
    parsed,
  };
}

export function formatError(error: any) {
  if (
    error?.message?.includes("insufficient funds") ||
    error?.message?.includes("enough funds") ||
    error.data?.message.includes("insufficient funds") ||
    error.data?.message.includes("enough balance")
  ) {
    return new Error("Insufficient funds in wallet");
  } else if (error.message?.includes("Ledger")) {
    return new Error("Ledger error, please check your device");
  } else if (error.code === -32002 && error.message?.includes("pending")) {
    return new Error("There is an ongoing transaction on your wallet");
  } else if (
    error.message?.includes("UserRefusedOnDevice") ||
    error.message?.includes("User rejected")
  ) {
    return new Error("Transaction rejected");
  } else if (
    error.code === 4001 ||
    error.code === "ACTION_REJECTED" ||
    error?.message?.includes("Rejected Request") ||
    error?.message?.toLowerCase()?.includes("user canceled")
  ) {
    return new Error("Transaction rejected");
  } else if (error?.message?.includes("NUMERIC_FAULT-overflow")) {
    return new Error("Wallet connect transaction unsuccessful");
  }
  return error;
}
