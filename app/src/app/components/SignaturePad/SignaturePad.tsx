import React, { Component } from 'react'
import CanvasDraw from "react-canvas-draw";
import BinderButton from '../BinderButton';

export class SignaturePadTest extends Component {
  saveableCanvas: any;
  loadableCanvas: any;

  state = {
    color: "#ffc600",
    width: 320,
    height: 320,
    brushRadius: 10,
    lazyRadius: 12,
    savedCanvasData: undefined
  };
  componentDidMount(): void {
    // let's change the color randomly every 2 seconds. fun!
    window.setInterval(() => {
      this.setState({
        color: "#" + Math.floor(Math.random() * 16777215).toString(16)
      });
    }, 2000);
  }
  render() {
    console.log("this state savedCanvasData", this.state.savedCanvasData);

    return (
      <div className="w-96 h-96 m-auto">
        <button
            onClick={() => {
              if (this.saveableCanvas) {
                this.setState({
                  ...this.state,
                  savedCanvasData: this.saveableCanvas.getSaveData()
                })
              }
            }}
          >
            Save
          </button>
            <button
            onClick={() => {
              this.setState({
                ...this.state,
                savedCanvasData: undefined
              })
              const onCanvas = !!this.saveableCanvas;
              if (onCanvas) {
                this.saveableCanvas.eraseAll();
              }
            }}
          >
            clear all
          </button>
          <button
            onClick={() => {
              const onCanvas = !!this.saveableCanvas;
              if (onCanvas) {
                this.saveableCanvas.undo();
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
          {
            // @ts-ignore
            this.state.savedCanvasData ?
            <div>
              <CanvasDraw
                ref={(canvasDraw) => {
                  this.loadableCanvas = canvasDraw
                }}
                // @ts-ignore
                saveData={this.state.savedCanvasDeeata || ""}
                disabled
                hideGrid
              />
            </div>
            :
            <div>
              <CanvasDraw
                ref={(canvasDraw) => {
                  this.saveableCanvas = canvasDraw
                }}
                brushColor={this.state.color}
                brushRadius={this.state.brushRadius}
                lazyRadius={this.state.lazyRadius}
              />
            </div>
          }
          <BinderButton className="w-3/4 bg-black" primary>
            Submit
          </BinderButton>
      </div>
    )
  }
}
