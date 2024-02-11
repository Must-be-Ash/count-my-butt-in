import { Campaign, User } from "@prisma/client";
import useSWR from "swr";

export const fetchSWR = async (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.campaign);
};

export function useCampaign(campaignId: string, includeUser = false) {
  const { data, error, isLoading, mutate } = useSWR<Campaign>(
    `/api/campaigns/${campaignId}?includeUser=${includeUser}`,
    fetchSWR
  );

  return {
    campaign: data as Campaign & { user?: User },
    isLoading,
    isError: error,
    error: error,
    refetchCampaign: mutate,
  };
}
