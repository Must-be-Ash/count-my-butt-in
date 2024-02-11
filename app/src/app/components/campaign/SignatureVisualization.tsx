import React from "react";
import CanvasDraw from "react-canvas-draw";

type CanvasState = {
  color: string;
  brushRadius: number;
  lazyRadius: number;
  savedCanvasData: any;
};
export default function SignatureVisualization({
  savedCanvasData,
  backgroundImage,
}: {
  savedCanvasData: any;
  backgroundImage: string;
}) {
  const state = {
    color: "white",
    brushRadius: 5,
    lazyRadius: 5,
    savedCanvasData,
  };
  return (
    <div className="m-auto w-[100%]">
      <CanvasToDrawOn state={state} backgroundImage={backgroundImage} />
    </div>
  );
}

const CanvasToDrawOn = ({
  state,
  backgroundImage,
}: {
  state: CanvasState;
  backgroundImage: string;
}) => {
  const style = {
    backgroundImage: `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
    backgroundSize: `cover`,
    borderRadius: `8px`,
    // boxShadow: `rgba(0, 0, 0, 0.1) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px`,
    width: "100%",
  };
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
};
