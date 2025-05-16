import { useQuery } from "@apollo/client";
import { PRODUCTS_BY_ID_QUERY } from "~/graphql";
import type { ProductsByIdsQueryData } from "~/types";

const CHANNEL = "europe";

export const usePreselectedProducts = (ids: string[]) => {
  const idsQuery = ids.length ? ids.map((id) => `id:${id}`).join(" OR ") : "";

  return useQuery<ProductsByIdsQueryData>(PRODUCTS_BY_ID_QUERY, {
    variables: {
      query: idsQuery,
      channel: CHANNEL,
    },
    skip: !idsQuery,
  });
};
