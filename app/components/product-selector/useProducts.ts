import { useQuery } from "@apollo/client";
import { PRODUCTS_QUERY } from "~/graphql";
import type { ProductsQueryData } from "~/types";

const CHANNEL = "europe";
const PAGE_SIZE = 10;

export const useProducts = (searchTerm: string, after: string | null) => {
  return useQuery<ProductsQueryData>(PRODUCTS_QUERY, {
    variables: {
      first: PAGE_SIZE,
      after,
      query: searchTerm,
      channel: CHANNEL,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });
};
