import * as React from "react";
import { createContext, useContext } from "react";

const instanceContext = createContext({
  nft: {
    nftNetworkId: 0,
    contractAddress: "",
    tokenId: "",
    nftUrl: "",
    name: ""
  },
  note: '',
  setNote: (value: string) => {},
  setNft: (value: {
    nftNetworkId: number;
    contractAddress: string;
    tokenId: string;
    nftUrl: string;
    name: string;
  }) => {},
});

export function InstanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nft, setNft] = React.useState({
    nftNetworkId: 0,
    contractAddress: "",
    tokenId: "",
    nftUrl: "",
    name: ""
  });
  const [note, setNote] = React.useState('');

  return (
    <instanceContext.Provider value={{ nft, note, setNote, setNft }}>
    {children}
  </instanceContext.Provider>
  );
}

export const useInstance = () => useContext(instanceContext);
