import React, { Component, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import BinderButton from "../BinderButton";
import APIHelpers from "@/lib/apiHelper";
import { NetworkStatus } from "@prisma/client";

export interface SignaturePadProps {
  closeModal: () => void;
  backgroundImage: string;
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
  const [state, setState] = useState({
    color: "#ffc600",
    width: 320,
    height: 320,
    brushRadius: 10,
    lazyRadius: 12,
    savedCanvasData: undefined,
  });
  const [saveableCanvas, setSavedCanvasData] = useState<any | null>(null);
  const [loadableCanvas, setLoadableCanvas] = useState<any | null>(null);
  return (
    <div className="w-96 h-96 m-auto">
      <button
        onClick={async () => {
          if (saveableCanvas) {
            await APIHelpers.patch(`/api/campaigns/1/orders/${orderId}`, {
              body: {
                autographData: saveableCanvas.getSaveData(),
                autographDataURL: saveableCanvas.getDataURL(),
                status: NetworkStatus.CONFIRMED,
              },
            });
            closeModal();
          }
        }}
        className="mr-3"
      >
        Save
      </button>
      <button
        onClick={() => {
          setState({
            ...state,
            savedCanvasData: undefined,
          });
          const onCanvas = !!saveableCanvas;
          if (onCanvas) {
            saveableCanvas.eraseAll();
          }
        }}
        className="mr-3"
      >
        Clear all
      </button>
      <button
        onClick={() => {
          const onCanvas = !!saveableCanvas;
          if (onCanvas) {
            saveableCanvas.undo();
          }
        }}
      >
        Undo
      </button>
      {/* <button
            onClick={() => {
              const onCanvas = !!this.saveableCanvas;
              if (onCanvas) {
                console.log(this.saveableCanvas.getDataURL());
              }
              alert("DataURL written to console")
            }}
          >
            GetDataURL
          </button> */}
      {/* <div>
            <label>Brush-Radius:</label>
            <input
              type="number"
              value={this.state.brushRadius}
              onChange={e =>
                this.setState({ brushRadius: parseInt(e.target.value, 10) })
              }
            />
          </div> */}
      {/* <div>
            <label>Lazy-Radius:</label>
            <input
              type="number"
              value={this.state.lazyRadius}
              onChange={e =>
                this.setState({ lazyRadius: parseInt(e.target.value, 10) })
              }
            />
          </div> */}
      {state.savedCanvasData ? (
        <div>
          <CanvasDraw
            ref={(canvasDraw) => {
              setLoadableCanvas(canvasDraw);
            }}
            imgSrc={backgroundImage}
            saveData={state.savedCanvasData || ""}
            disabled
            hideGrid
          />
        </div>
      ) : (
        <div>
          <CanvasDraw
            ref={(canvasDraw) => {
              setSavedCanvasData(canvasDraw);
            }}
            imgSrc={backgroundImage}
            brushColor={state.color}
            brushRadius={state.brushRadius}
            lazyRadius={state.lazyRadius}
          />
        </div>
      )}
    </div>
  );
}
