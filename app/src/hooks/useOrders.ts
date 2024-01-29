import useSWR from "swr";
import { Order } from "@prisma/client";

export const fetchSWR = async (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.orders);
};

export function useOrders(campaignId: string) {
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
