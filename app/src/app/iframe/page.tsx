"use client"
import APIHelpers from "@/lib/apiHelper";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { Order } from "@prisma/client";

const useIframeData = ({
  tokenId, collectionAddress
}: {
  tokenId: string|null, collectionAddress: string|null
}): { data: Order, loading: boolean } => {
  const [data, setData] = useState<Order>();
  const [loading, setLoading] = useState<boolean>(false);
  const get = async () => {
    setLoading(true);
    const nft = (await APIHelpers.post(`/api/iframe`, {
      body: {
        tokenId, collectionAddress
      }
    })).data;
    setData(nft);
    setLoading(false);
    return nft;
  }
  useEffect(() => {
    if (tokenId && collectionAddress) {
      get();
    }
  }, [tokenId, collectionAddress]);
  return {data, loading};
}

export default function IFrame () {
  const params = useSearchParams();
  const tokenId = params.get("tokenId");
  const collectionAddress = params.get("collectionAddress");
  const {data, loading} = useIframeData({
    tokenId, collectionAddress
  });
  const backgroundImage = data?.nftImageURL;

  const state = {
    color: "white",
    brushRadius: 5,
    lazyRadius: 5,
    savedCanvasData: data?.autographData,
  };

  const style = {
    backgroundImage: `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
    backgroundSize: `cover`,
    borderRadius: `8px`,
    width: "800px",
    height: "800px"
  };

  if (loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  return (
    <div className="w-screen h-screen">
      <CanvasDraw
          ref={(canvasDraw) => {
            if (canvasDraw && state.savedCanvasData) {
              return canvasDraw.loadSaveData(state.savedCanvasData);
            }
          }}
          brushColor={state.color}
          brushRadius={state.brushRadius}
          lazyRadius={state.lazyRadius}
          disabled
          hideGrid
          style={style}
        />
    </div>
  )
}
