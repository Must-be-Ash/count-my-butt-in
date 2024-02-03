import { getCampaignForUser, getOrderBySubmittedToken, getUserByDomain } from "./prisma";

export default async function getIframeData({
  collectionAddress,
  tokenId,
}: {
  collectionAddress: string,
  tokenId: string,
}) {
  const order =  await getOrderBySubmittedToken(tokenId, collectionAddress);
  console.log({order});
  return order;
}
