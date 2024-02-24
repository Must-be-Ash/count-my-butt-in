import { uploadMetadata } from "@/lib/ipfs";
import { nameToNetwork } from "@/lib/utils";
import { getOrders, updateCampaign, updateOrder } from "@/utils/prisma";
import { Order } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

/*
 * Grab all confirmed orders, generate ipfs link for autograph and metadata then append to Order model the metadata url
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  const { twitterUsername } = await request.json();
  // get all pending orders
  const ordersToUpload = await getOrders(params.campaignId, "PENDING");
  // do not trigger upload until all orders are signed
  if (ordersToUpload.some((order: Order) => !order.toUpload)) {
    return NextResponse.json({ manifestUrl: "" });
  }

  if (!ordersToUpload.length) {
    return NextResponse.json({ manifestUrl: "" });
  }

  // hardcoded for now
  // const defaultMetadata = DEFAULT_METADATA;
  const currentDate = new Date();
  const manifestUrl = await uploadMetadata(
    "defaultMetadata",
    ordersToUpload
      .sort((a: any, b: any) => a.createdAt - b.createdAt)
      .map((order: Order) => ({
        name: "Signed Autograph",
        description: twitterUsername
          ? `Signed by [@${twitterUsername}](https://twitter.com/${twitterUsername}). ${
              order.collectionAddress && order.selectedTokenId
                ? `Look it up at [Binder](https://app.signed.gg/asset/${order.collectionNetwork.toLowerCase()}/${
                    order.collectionAddress
                  }/${order.selectedTokenId})`
                : ""
            }`
          : `Signed Autograph. ${
              order.collectionAddress && order.selectedTokenId
                ? `Look it up at [Binder](https://app.signed.gg/asset/${order.collectionNetwork.toLowerCase()}/${
                    order.collectionAddress
                  }/${order.selectedTokenId})`
                : ""
            }`,
        attributes: twitterUsername
          ? [
              {
                trait_type: "Date",
                value: `${
                  currentDate.getMonth() + 1
                }/${currentDate.getDate()}/${currentDate.getFullYear()}`,
              },
              {
                trait_type: "Social",
                value: "Twitter",
              },
              {
                trait_type: "Username",
                value: twitterUsername,
              },
            ]
          : undefined,
        image: order.toUpload,
        image_url: order.toUpload,
        animation_url: `https://iframe-ten-tau.vercel.app/?for=${order.orderId}`,
      }))
  );
  // update metadata url of each order
  for (const order of ordersToUpload) {
    await updateOrder(order.orderId, {
      metadataUrl: `${manifestUrl}/${order.mintedTokenId}`,
    });
  }
  // update manifest url of campaign
  await updateCampaign(params.campaignId, { manifestUrl });

  return NextResponse.json({ manifestUrl });
}
