import { uploadMetadata } from "@/lib/ipfs";
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
  const defaultMetadata = {
    created_by: "Binder Studio",
    description: "Binder Signature Drop, Power by [Binder](https://signed.gg/)",
    external_url: "https://signed.gg",
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
    animation_details: {
      bytes: 1636135,
      format: "MP4",
      duration: 11,
      sha256:
        "2f10aab908e915631664eb0a7d5ae04afe85f31fb97bd59b09d676e75753bde0",
      width: 1080,
      height: 1080,
      codecs: ["H.264", "AAC"],
    },
    animation:
      "https://arweave.net/aZBb0n-kqSh7eyNcxw4KhAyCBCcQyGO1GnWbV2e0Hcw",
    animation_url:
      "https://arweave.net/aZBb0n-kqSh7eyNcxw4KhAyCBCcQyGO1GnWbV2e0Hcw",
  };
  const currentDate = new Date();
  const manifestUrl = await uploadMetadata(
    defaultMetadata,
    ordersToUpload
      .sort((a, b) => Number(a.mintedTokenId) - Number(b.mintedTokenId))
      .map((order) => ({
        name: "Signed Autograph",
        description: twitterUsername
          ? `Signed by [@${twitterUsername}](https://twitter.com/${twitterUsername})`
          : "Signed Autograph",
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
