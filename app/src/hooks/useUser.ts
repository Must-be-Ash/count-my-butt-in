import useSWR from "swr";
import { User } from "@prisma/client";

export const fetchSWR = async (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.user);
};

export function useUser(userId: string) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    `/api/users/${userId}`,
    fetchSWR
  );

  return {
    user: data,
    isLoading,
    isError: error,
    error: error,
    refetchUser: mutate,
  };
}
