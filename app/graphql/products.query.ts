import { gql } from "@apollo/client";

export const PRODUCTS_QUERY = gql`
  query Products(
    $first: Int!
    $after: String
    $query: String
    $channel: String!
  ) {
    products(first: $first, after: $after, query: $query, channel: $channel) {
      edges {
        node {
          id
          name
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
