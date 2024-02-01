import { getCampaignForUser, getUserByDomain } from "./prisma";

export default async function getArtistCampaignFromHost(host: string | null) {
  if (!host) {
    return undefined;
  }
  const artist = await getUserByDomain(host);
  if (!artist) {
    return undefined;
  }
  const campaign = await getCampaignForUser(artist.id);
  if (campaign.length < 1) {
    return undefined;
  }
  return { campaign: campaign[0], artist: {
    nickname: artist.nickname,
    twitterUsername: artist.twitterUsername,
    imageUrl: artist.imageUrl
  } }
}
