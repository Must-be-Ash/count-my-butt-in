import { uploadFile, uploadMetadata } from "@/lib/ipfs";
import { getOrders, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Grab all confirmed orders, generate ipfs link for autograph and metadata then append to Order model the metadata url
 */
export async function POST(
  _: NextRequest,
  { params }: { params: { orderId: string } }
) {
  // get all confirmed orders
  const orders = await getOrders(params.orderId, "CONFIRMED");
  // upload metadata to ipfs
  for (const order of orders) {
    const { autographData, autographDataURL, metadataUrl, orderId } = order;
    // upload and update autographUrl
    if (!autographDataURL) {
      const autographUrl = await uploadFile(autographData);
      await updateOrder(orderId, { autographDataURL: autographUrl });
    }
    // upload and update metadata
    if (!metadataUrl) {
      const metadata = {
        name: "RANDOM NAME",
        description: "RANDOM DESCRIPTION",
        image: autographData,
        image_url: autographData,
      };

      const metadataUrl = await uploadMetadata(metadata);
      await updateOrder(orderId, { metadataUrl });
    }
  }

  return NextResponse.json({ orders });
}
