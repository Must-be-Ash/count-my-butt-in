// import { uploadFile } from "@/lib/ipfs";
import { deleteOrder, getOrder, updateOrder } from "@/utils/prisma";
import { overlayImages } from "@/utils/processImage";
import { Order } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const order = await getOrder(params.orderId);
  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {

  const data = await request.json() as Order;
  let toUpload = '';
  if (data.nftImageURL && data.autographDataURL) {
    toUpload = await overlayImages({
      url: data.nftImageURL,
      overlaySignature: data.autographDataURL
    })
  }


  // // if autographDataURL is not ipfs link, upload to ipfs
  // if (data.autographDataURL && !data.autographDataURL.includes("ipfs")) {
  //   const byteCharacters = atob(data.autographDataURL.split(",")[1]);

  //   // Creating a Uint8Array for the binary data
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (var i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }

  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: "image/png" });
  //   const url = await uploadFile(blob);
  //   data.autographDataURL = url;
  // }
  const order = await updateOrder(params.orderId, {...data, toUpload});

  return NextResponse.json({ order });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const order = await deleteOrder(params.orderId);
  return NextResponse.json({ order });
}
