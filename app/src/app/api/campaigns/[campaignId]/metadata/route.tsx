import { uploadFile, uploadMetadata } from "@/lib/ipfs";
import { getOrders, updateCampaign, updateOrder } from "@/utils/prisma";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Grab all confirmed orders, generate ipfs link for autograph and metadata then append to Order model the metadata url
 */
export async function POST(
  _: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  // get all confirmed orders
  const orders = await getOrders(params.campaignId, "CONFIRMED");
  const ordersToUpload = orders.filter(
    (order) => !order.metadataUrl && order.autographDataURL
  );

  if (!ordersToUpload.length) {
    return NextResponse.json({ orders: [] });
  }

  // hardcoded for now
  const defaultMetadata = {
    created_by: "Binder Studio",
    description: "Binder Signature Drop",
    external_url: "https://binder.studio/",
    name: "Binder Drop",
    image_details: {
      bytes: 314183,
      format: "PNG",
      sha256:
        "6e072dffcd7dddbd8c5a4797d5ca25e6013363d1f899b22b5c01178e3d2c3853",
      width: 4320,
      height: 4320,
    },
    image: "https://arweave.net/qWfD01lnf6A9dWcNSxZ6ZCWSZ7CgVz5iq99j7QhHW6c",
    image_url:
      "https://arweave.net/qWfD01lnf6A9dWcNSxZ6ZCWSZ7CgVz5iq99j7QhHW6c",
  };

  const manifestUrl = await uploadMetadata(
    defaultMetadata,
    ordersToUpload.map((order) => ({
      name: "My Signature",
      description: "My Signature",
      image: order.autographDataURL,
      image_url: order.autographDataURL,
    }))
  );
  // update metadata url of each order
  for (const order of ordersToUpload) {
    await updateOrder(order.orderId, {
      metadataUrl: `${manifestUrl}${order.mintedTokenId}`,
    });
  }
  // update manifest url of campaign
  await updateCampaign(params.campaignId, { manifestUrl });

  return NextResponse.json({ orders: ordersToUpload });
}
