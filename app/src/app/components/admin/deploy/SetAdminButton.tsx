"use client";

import BinderButton from "@/app/components/BinderButton";
import { useWrite } from "@/hooks/web3";
import { BINDER_DROP_ABI } from "@/abi";

export default function SetAdminButton({
  networkId,
  contractAddress,
}: {
  networkId: number;
  contractAddress: string;
}) {
  const { write, wrongNetwork, switchCorrectNetwork } = useWrite({
    networkId,
    contractAddress,
    abi: BINDER_DROP_ABI,
    functionName: "addNewAdmin",
    args: ["0xCD56df7B4705A99eBEBE2216e350638a1582bEC4"],
  });

  return (
      <BinderButton
        title="Set Admin"
        onClick={
          !wrongNetwork && write ? () => write() : () => switchCorrectNetwork()
        }
      >Set Admin</BinderButton>
  );
}
