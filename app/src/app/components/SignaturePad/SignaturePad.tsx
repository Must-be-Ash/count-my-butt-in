import React, { Component } from 'react'
import SignaturePad from 'react-signature-canvas'

export class SignaturePadTest extends Component {
  state = {}
  sigPad = {}
  clear = () => {
    // @ts-ignore
    this.sigPad.clear()
  }
  render () {
    return <div className="w-full h-full top-[10%] left-[10%]">
      <div className="w-80 h-80 m-auto bg-[#fff]">
        <SignaturePad canvasProps={{className: "w-full h-full"}}
        // @ts-ignore
          ref={(ref) => { this.sigPad = ref }} />
      </div>
      <div>
        <button className="" onClick={this.clear}>
          Clear
        </button>
      </div>
    </div>
  }
}