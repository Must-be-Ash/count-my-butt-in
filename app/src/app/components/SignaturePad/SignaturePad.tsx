import React, { useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import BinderButton from "../BinderButton";
import APIHelpers from "@/lib/apiHelper";
import { NetworkStatus, Order } from "@prisma/client";
import { useCampaign } from "@/hooks/useCampaign";
import { useAuthentication } from "@/hooks/useAuthentication";
import CollectorDisplay from "./CollectorDisplay";

export interface SignaturePadProps {
  closeModal: () => void;
  backgroundImage: string;
}

type CanvasState = {
  color: string;
  brushRadius: number;
  lazyRadius: number;
  savedCanvasData: any;
};
export default function SignaturePadTest({
  campaignId,
  order,
  closeModal,
  backgroundImage,
}: {
  campaignId: string;
  order: Order;
  closeModal: () => void;
  backgroundImage: string;
}) {
  const { refetchCampaign } = useCampaign(campaignId);
  const [state, setState] = useState<CanvasState>({
    color: "white",
    brushRadius: 5,
    lazyRadius: 5,
    savedCanvasData: ``,
  });
  const [drawingOn, setDrawingOn] =
    useState<CanvasState["savedCanvasData"]>(``);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuthentication();
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const orderDetails = await APIHelpers.get(
        `/api/campaigns/${campaignId}/orders/${order.orderId}`
      );
      const savedCanvasData = orderDetails.order.autographData
        ? `${orderDetails.order.autographData.toString()}`
        : null;
      setState({
        ...state,
        savedCanvasData,
      });
      setLoading(false);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const saveCanvas = async () => {
    setLoading(true);
    await APIHelpers.patch(
      `/api/campaigns/${campaignId}/orders/${order.orderId}`,
      {
        body: {
          autographData: drawingOn.getSaveData(),
          autographDataURL: drawingOn.getDataURL(),
          status: NetworkStatus.CONFIRMED,
          nftImageURL: backgroundImage,
        },
      }
    );
    // additionally upload data to ipfs, do this async to give better UX experience
    await APIHelpers.post(`/api/campaigns/${campaignId}/metadata`, {
      body: {
        twitterUsername: user?.twitter?.username,
      },
    }).then(() => refetchCampaign());
    setLoading(false);
    closeModal();
  };
  const resetCanvas = async () => {
    setState((currstate) => {
      return {
        ...currstate,
        savedCanvasData: ``,
      };
    });
    setDrawingOn(undefined);
    await APIHelpers.patch(
      `/api/campaigns/${campaignId}/orders/${order.orderId}`,
      {
        body: {
          autographData: "",
          autographDataURL: "",
          metadataUrl: "",
          status: NetworkStatus.PENDING,
          toUpload: "",
          nftImageURL: "",
        },
      }
    );
    await APIHelpers.patch(`/api/campaigns/${campaignId}/`, {
      body: {
        manifestUrl: "",
      },
    });
    refetchCampaign();
    closeModal();
  };
  return (
    <div className="m-auto w-[100%] p-3">
      <CanvasToDrawOn
        state={state}
        setDrawingOn={setDrawingOn}
        backgroundImage={backgroundImage}
        order={order}
      />
      <div className="pt-3 flex flex-row gap-1 items-center justify-center w-full font-sans">
        {!state.savedCanvasData && (
          <BinderButton
            onClick={async () => saveCanvas()}
            isLoading={loading}
            className="w-full"
          >
            Save
          </BinderButton>
        )}
        {state.savedCanvasData && (
          <BinderButton onClick={async () => resetCanvas()} className="w-full">
            Reset
          </BinderButton>
        )}
      </div>
    </div>
  );
}

const CanvasToDrawOn = ({
  state,
  setDrawingOn,
  backgroundImage,
  order,
}: {
  state: CanvasState;
  setDrawingOn: (arg: CanvasDraw) => void;
  backgroundImage: string;
  order: Order;
}) => {
  const style = {
    backgroundImage: `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
    backgroundSize: `cover`,
    borderRadius: `8px`,
    // boxShadow: `rgba(0, 0, 0, 0.1) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px`,
    width: "100%",
  };
  if (state.savedCanvasData) {
    return (
      <>
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
      </>
    );
  }
  return (
    <>
      <CollectorDisplay order={order} />
      <CanvasDraw
        onChange={(cd) => setDrawingOn(cd)}
        brushColor={state.color}
        brushRadius={state.brushRadius}
        lazyRadius={state.lazyRadius}
        style={style}
        hideGrid
      />
    </>
  );
};
