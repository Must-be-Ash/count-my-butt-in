import React, { Component, useEffect, useState } from "react";
import CanvasDraw, { CanvasDrawProps } from "react-canvas-draw";
import BinderButton from "../BinderButton";
import APIHelpers from "@/lib/apiHelper";
import { NetworkStatus } from "@prisma/client";
import { useCampaign } from "@/hooks/useCampaign";

export interface SignaturePadProps {
  closeModal: () => void;
  backgroundImage: string;
}

type CanvasState = {
  color: string;
  width: number;
  height: number;
  brushRadius: number;
  lazyRadius: number;
  savedCanvasData: any;
};
export default function SignaturePadTest({
  campaignId,
  orderId,
  closeModal,
  backgroundImage,
}: {
  campaignId: string;
  orderId: string;
  closeModal: () => void;
  backgroundImage: string;
}) {
  const { refetchCampaign } = useCampaign(campaignId);
  const [state, setState] = useState<CanvasState>({
    color: "white",
    width: 320,
    height: 320,
    brushRadius: 5,
    lazyRadius: 5,
    savedCanvasData: ``,
  });
  const [drawingOn, setDrawingOn] =
    useState<CanvasState["savedCanvasData"]>(``);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const orderDetails = await APIHelpers.get(
        `/api/campaigns/${campaignId}/orders/${orderId}`
      );
      const savedCanvasData = `${orderDetails.order.autographData.toString()}`;
      setState({
        ...state,
        savedCanvasData,
      });
      setLoading(false);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const saveCanvas = async () => {
    await APIHelpers.patch(`/api/campaigns/${campaignId}/orders/${orderId}`, {
      body: {
        autographData: drawingOn.getSaveData(),
        autographDataURL: drawingOn.getDataURL(),
        status: NetworkStatus.CONFIRMED,
      },
    });
    // additionally upload data to ipfs, do this async to give better UX experience
    APIHelpers.post(`/api/campaigns/${campaignId}/metadata`).then(() =>
      refetchCampaign()
    );
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
    await APIHelpers.patch(`/api/campaigns/${campaignId}/orders/${orderId}`, {
      body: {
        autographData: "",
        autographDataURL: "",
        metadataUrl: "",
        status: NetworkStatus.PENDING,
      },
    });
    await APIHelpers.patch(`/api/campaigns/${campaignId}/`, {
      body: {
        manifestUrl: "",
      },
    });
    refetchCampaign();
    closeModal();
  };
  return (
    <div className="w-96 h-96 m-auto">
      <div className="pb-3">
        <CanvasToDrawOn
          state={state}
          setDrawingOn={setDrawingOn}
          backgroundImage={backgroundImage}
        />
      </div>
      <div className="w-full flex flex-col items-center">
        {!state.savedCanvasData && (
          <BinderButton onClick={async () => saveCanvas()} title="Save" primary />
        )}
        {state.savedCanvasData && (
          <BinderButton
            onClick={async () => resetCanvas()}
            primary
            title="Reset"
          />
        )}
      </div>
    </div>
  );
}

const CanvasToDrawOn = ({
  state,
  setDrawingOn,
  backgroundImage,
}: {
  state: CanvasState;
  setDrawingOn: (arg: CanvasDraw) => void;
  backgroundImage: string;
}) => {
  if (state.savedCanvasData) {
    return (
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
        style={{
          backgroundImage: `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        }}
      />
    );
  }
  return (
    <CanvasDraw
      onChange={(cd) => setDrawingOn(cd)}
      brushColor={state.color}
      brushRadius={state.brushRadius}
      lazyRadius={state.lazyRadius}
      style={{
        backgroundImage: `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
      }}
      hideGrid
    />
  );
};
