import useSWR from "swr";
import { NetworkStatus, Order } from "@prisma/client";
import { Network } from "ethers";

export const fetchSWR = async (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.orders);
};

export function useOrders(campaignId: string) {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    `/api/campaigns/${campaignId}/orders?status=PENDING`,
    fetchSWR
  );

  return {
    orders: data,
    isLoading,
    isError: error,
    error: error,
    refetchOrders: mutate,
  };
}

export function useConfirmedOrders(campaignId: string) {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    `/api/campaigns/${campaignId}/orders?status=CONFIRMED`,
    fetchSWR
  );

  return {
    orders: data,
    isLoading,
    isError: error,
    error: error,
    refetchOrders: mutate,
  };
}

/*
 * Get orders by userId (We refer to privyUserId as userId)
 */
export function useOrdersByUser(privyUserId: string) {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    `/api/users/${privyUserId}/orders?usePrivyId=true`,
    fetchSWR
  );

  return {
    orders: data,
    isLoading,
    isError: error,
    error: error,
    refetchOrders: mutate,
  };
}

/*
 * Get orders by campaignId
 */
export function useOrdersByCampaignId(campaignId: string) {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    `/api/campaigns/${campaignId}/orders`,
    fetchSWR
  );

  return {
    orders: data,
    isLoading,
    isError: error,
    error: error,
    refetchOrders: mutate,
  };
}
