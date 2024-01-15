import React, { Component, useEffect, useState } from "react";
import CanvasDraw, { CanvasDrawProps } from "react-canvas-draw";
import BinderButton from "../BinderButton";
import APIHelpers from "@/lib/apiHelper";
import { NetworkStatus } from "@prisma/client";

export interface SignaturePadProps {
  closeModal: () => void;
  backgroundImage: string;
}

type CanvasState = {
  color: string,
  width: number,
  height: number,
  brushRadius: number,
  lazyRadius: number,
  savedCanvasData: any,
}
export default function SignaturePadTest({
  orderId,
  closeModal,
  backgroundImage,
}: {
  orderId: string;
  closeModal: () => void;
  backgroundImage: string;
}) {
  const [state, setState] = useState<CanvasState>({
    color: "#ffc600",
    width: 320,
    height: 320,
    brushRadius: 10,
    lazyRadius: 12,
    savedCanvasData: ``,
  });
  const [drawingOn, setDrawingOn] = useState<CanvasState["savedCanvasData"]>(``);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const orderDetails = await APIHelpers.get(`/api/campaigns/1/orders/${orderId}`);
      const savedCanvasData = `${orderDetails.order.autographData.toString()}`;
      setState({
        ...state,
        savedCanvasData,
      })
      setLoading(false);
    }
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const saveCanvas = async () => {
    await APIHelpers.patch(`/api/campaigns/1/orders/${orderId}`, {
      body: {
        autographData: drawingOn.getSaveData(),
        autographDataURL: drawingOn.getDataURL(),
        status: NetworkStatus.CONFIRMED,
      }
    })
    closeModal();
  }
  const resetCanvas = async () => {
    setState((currstate) => {
      return {
        ...currstate,
        savedCanvasData: ``
      }
    })
    setDrawingOn(undefined)
    await APIHelpers.patch(`/api/campaigns/1/orders/${orderId}`, {
      body: {
        autographData: "",
        autographDataURL: "",
        status: NetworkStatus.PENDING,
      }
    })
    closeModal();
  }
  return (
    <div className="w-96 h-96 m-auto">
      {
        !state.savedCanvasData && (
          <button onClick={async () => saveCanvas()} className="mr-3" >
            Save
          </button>
        )
      }
      {
        state.savedCanvasData &&
        <button onClick={async () => resetCanvas()} className="mr-3" >
          Reset
        </button>
      }
      <CanvasToDrawOn
        state={state}
        setDrawingOn={setDrawingOn}
        backgroundImage={backgroundImage}
      />
    </div>
  );
}

const CanvasToDrawOn = ({state, setDrawingOn, backgroundImage}: {state: CanvasState, setDrawingOn: (arg: CanvasDraw) => void, backgroundImage: string}) => {
  if (state.savedCanvasData) {
    return (
      <>
        <CanvasDraw
          ref={(canvasDraw) => {
            if (canvasDraw && state.savedCanvasData) {
              return canvasDraw.loadSaveData(state.savedCanvasData)
            }
          }}
          imgSrc={backgroundImage}
          brushColor={state.color}
          brushRadius={state.brushRadius}
          lazyRadius={state.lazyRadius}
          disabled
        />
      </>
    )
  }
  return (
    <CanvasDraw
      onChange={(cd) =>  setDrawingOn(cd)}
      imgSrc={backgroundImage}
      brushColor={state.color}
      brushRadius={state.brushRadius}
      lazyRadius={state.lazyRadius}
      backgroundColor="black"
    />
  )
}
