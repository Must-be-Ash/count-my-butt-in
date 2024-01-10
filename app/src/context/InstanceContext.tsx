import * as React from "react";
import { createContext, useContext } from "react";

export interface Instance {
  orderId: string;
  campaignId: string;
  nftNetworkId: number;
  contractAddress: string;
  tokenId: string;
  mintedTokenId: string;
  nftUrl: string;
  name: string;
  note: string;
}

const instanceContext = createContext({
  instance: {
    orderId: "",
    campaignId: "",
    nftNetworkId: 0,
    contractAddress: "",
    tokenId: "",
    mintedTokenId: "",
    nftUrl: "",
    name: "",
    note: "",
  },

  setInstance: (_: Partial<Instance>) => {},
});

export function InstanceProvider({ children }: { children: React.ReactNode }) {
  const [instance, setInstance] = React.useState({
    orderId: "",
    campaignId: "",
    nftNetworkId: 0,
    contractAddress: "",
    tokenId: "",
    mintedTokenId: "",
    nftUrl: "",
    name: "",
    note: "",
  });

  return (
    <instanceContext.Provider
      value={{
        instance,
        setInstance: (value) =>
          setInstance({
            ...instance,
            ...value,
          }),
      }}
    >
      {children}
    </instanceContext.Provider>
  );
}

export const useInstance = () => useContext(instanceContext);
