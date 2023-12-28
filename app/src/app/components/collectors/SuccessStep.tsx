import NFTDisplayFull from "@/app/components/NftDisplayFull";
import BinderButton from "@/app/components/BinderButton";
import { getOpenseaLink } from "@/lib/utils";

export function SuccessStep({
  nft,
}: {
  nft: {
    nftNetworkId: number;
    contractAddress: string;
    tokenId: string;
    nftUrl: string;
    name: string;
  };
}) {
  return (
    <div className="bg-white p-4 rounded-lg max-w-sm mx-auto w-full">
      <div className="flex flex-row items-center justify-center">
        <NFTDisplayFull
          networkId={nft.nftNetworkId}
          tokenId={nft.tokenId}
          contractAddress={nft.contractAddress}
        />
      </div>

      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold">Congrats!</h1>
        <p className="mt-2 text-gray-600">
          Your token is waiting to be signed. You can head to your Binder
          profile and wait for the autograph to reveal or you can let us notify
          you via email.
        </p>
      </div>
      <div className="mt-6 space-y-4 w-full">
        <div className="w-full mx-auto">
          <BinderButton
            primary={true}
            onClick={() => {
              window.open(
                getOpenseaLink(
                  nft.nftNetworkId,
                  nft.contractAddress,
                  nft.tokenId
                )
              );
            }}
            title="See NFT"
            textColor="text-black"
            className="mx-auto text-center w-full"
          />
        </div>
      </div>
    </div>
  );
}
