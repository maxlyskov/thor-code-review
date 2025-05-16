export interface Product {
  id: string;
  name: string;
}

export interface ProductsQueryData {
  products: {
    edges: { node: Product; cursor: string }[];
    pageInfo: { hasNextPage: boolean; endCursor: string };
  };
}

export interface ProductsByIdsQueryData {
  products: {
    edges: { node: Product }[];
  };
}
