/**
 * this is the landing page of a particular campaign for
 * an artist, based on
 */
import { headers } from 'next/headers'
import CampaignLanding from './components/CampaignLanding';
import BigLoginDisplayPage from './components/BigLoginDisplayPage';
import getArtistAndCampaignFromHost from '@/utils/getArtistFromHost';

async function getArtist() {
  'use server'
  const headersList = headers();
  const host = headersList.get('host');
  const res = getArtistAndCampaignFromHost(host);
  return res;
}

export default async function Home() {
  const data = await getArtist();

  if (!data) {
    return <BigLoginDisplayPage />
  }

  return (
    <div>
      <CampaignLanding artist={data.artist} campaign={data.campaign} />
    </div>
  )
}
