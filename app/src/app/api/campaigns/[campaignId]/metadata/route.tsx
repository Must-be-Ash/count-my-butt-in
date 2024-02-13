import { uploadMetadata } from "@/lib/ipfs";
import { DEFAULT_METADATA } from "@/utils/common";
import { getOrders, updateCampaign, updateOrder } from "@/utils/prisma";
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
  const pendingOrders = await getOrders(params.campaignId, "PENDING");
  // do not trigger upload until all orders are confirmed
  if (pendingOrders.length) {
    return NextResponse.json({ manifestUrl: "" });
  }
  // get all confirmed orders
  const ordersToUpload = await getOrders(params.campaignId, "CONFIRMED");

  if (!ordersToUpload.length) {
    return NextResponse.json({ manifestUrl: "" });
  }

  // hardcoded for now
  const defaultMetadata = DEFAULT_METADATA;
  const currentDate = new Date();
  const manifestUrl = await uploadMetadata(
    defaultMetadata,
    ordersToUpload
      .sort(
        (a: any, b: any) => Number(a.mintedTokenId) - Number(b.mintedTokenId)
      )
      .map((order: any) => ({
        name: "Signed Autograph",
        description: twitterUsername
          ? `Signed by [@${twitterUsername}](https://twitter.com/${twitterUsername}). ${
              order.collectionAddress && order.selectedTokenId
                ? `Look it up at [Binder](https://jadyn.signed.gg/asset/ethereum/${order.collectionAddress}/${order.selectedTokenId}) or [TokenBound](https://tokenbound.org/assets/ethereum/${order.collectionAddress}/${order.selectedTokenId})`
                : ""
            }`
          : `Signed Autograph. ${
              order.collectionAddress && order.selectedTokenId
                ? `Look it up at [Binder](https://jadyn.signed.gg/asset/ethereum/${order.collectionAddress}/${order.selectedTokenId}) or [TokenBound](https://tokenbound.org/assets/ethereum/${order.collectionAddress}/${order.selectedTokenId})`
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
        // @todo add parent contract details
        // animation_url: `https://iframe-ten-tau.vercel.app/PARENT_CONTRACT_ADDRESS/PARENT_TOKEN_ID/PARENT_CHAIN_ID?childNetwork=CHILD_NETWORK_ID&flip=true`,
        image_canvas_data: order.autographData,
        parent_base_image: order.nftImageURL
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
