import * as React from "react";
import { createContext, useContext } from "react";

const selectedNftContext = createContext({
  nft: {
    nftNetworkId: 0,
    contractAddress: "",
    tokenId: "",
    nftUrl: "",
  },
  setNft: (value: {
    nftNetworkId: number;
    contractAddress: string;
    tokenId: string;
    nftUrl: string;
  }) => {},
});

export function SelectedNftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nft, setNft] = React.useState({
    nftNetworkId: 0,
    contractAddress: "",
    tokenId: "",
    nftUrl: "",
  });

  return (
    <selectedNftContext.Provider value={{ nft, setNft }}>
      {children}
    </selectedNftContext.Provider>
  );
}

export const useSelectedNft = () => useContext(selectedNftContext);
