import { gql } from "@apollo/client";

export const PRODUCTS_BY_ID_QUERY = gql`
  query Products($query: String!, $channel: String!) {
    products(channel: $channel, query: $query) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
