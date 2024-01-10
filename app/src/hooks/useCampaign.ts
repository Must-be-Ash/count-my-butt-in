import { Campaign } from "@prisma/client";
import useSWR from "swr";

export const fetchSWR = async (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.campaign);
};

export function useCampaign(campaignId: string) {
  const { data, error, isLoading } = useSWR<Campaign>(
    `/api/campaigns/${campaignId}`,
    fetchSWR
  );

  return {
    campaign: data,
    isLoading,
    isError: error,
    error: error,
  };
}
