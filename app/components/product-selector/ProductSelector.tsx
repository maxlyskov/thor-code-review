import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  TextInput,
  Heading,
  Spinner,
  Text,
  Pagination,
  ThemeProvider,
} from "@primer/react";

import { useDebounce } from "~/hooks";
import { ProductListItem } from "./ProductListItem";
import { useProducts } from "./useProducts";
import { usePreselectedProducts } from "./usePreSelectedProducts";

export interface ProductSelectorProps {
  onSubmit: (selectedIds: string | string[]) => void;
  selectedIds?: string | string[];
  multiple?: boolean;
}

const ProductSelector = ({
  onSubmit,
  selectedIds = [],
  multiple = false,
}: ProductSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(selectedIds) ? selectedIds : selectedIds ? [selectedIds] : []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [endCursors, setEndCursors] = useState<string[]>([]);

  const debouncedSearch = useDebounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setEndCursors([]);
  }, 300);

  const normalizedSelectedIds = useMemo(
    () =>
      Array.isArray(selectedIds)
        ? selectedIds
        : selectedIds
        ? [selectedIds]
        : [],
    [selectedIds]
  );

  const afterCursor = currentPage > 1 ? endCursors[currentPage - 2] : null;

  const { data, loading, error } = useProducts(searchTerm, afterCursor);

  const hasNextPage = data?.products.pageInfo.hasNextPage || false;
  const totalPages = Math.max(
    currentPage,
    hasNextPage ? currentPage + 1 : currentPage
  );

  const { data: preSelectedData } = usePreselectedProducts(
    normalizedSelectedIds
  );

  const products = data?.products.edges.map((edge) => edge.node) || [];
  const preSelected =
    preSelectedData?.products.edges.map((edge) => edge.node) || [];

  const mergedProducts = useMemo(
    () => [
      ...preSelected.filter((p) => !products.some((q) => q.id === p.id)),
      ...products,
    ],
    [preSelected, products]
  );

  useEffect(() => {
    const endCursor = data?.products.pageInfo.endCursor;
    if (endCursor && !endCursors.includes(endCursor)) {
      setEndCursors((prev) => {
        const newCursors = [...prev];
        newCursors[currentPage - 1] = endCursor;
        return newCursors;
      });
    }
  }, [data?.products.pageInfo.endCursor, currentPage]);

  const handleSelect = useCallback(
    (id: string) => {
      if (!multiple) {
        setSelected([id]);
      } else {
        setSelected((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
      }
    },
    [multiple]
  );

  const handleSubmit = useCallback(() => {
    onSubmit(multiple ? selected : selected[0] || "");
  }, [multiple, selected, onSubmit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  return (
    <ThemeProvider>
      <Box
        sx={{
          width: 1000,
          m: 5,
          p: 4,
          borderRadius: 2,
          boxShadow: "shadow.large",
          bg: "canvas.default",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
      >
        <Heading sx={{ mb: 3, fontSize: 4 }}>Product Selector</Heading>

        <TextInput
          placeholder="Search products..."
          onChange={handleSearchChange}
          sx={{ mb: 4, height: 40, fontSize: 2 }}
          autoFocus
        />

        {error && <Text color="danger.fg">Error: {error.message}</Text>}

        {mergedProducts.length === 0 && !loading && (
          <Text sx={{ color: "fg.muted", textAlign: "center" }}>
            No products found.
          </Text>
        )}

        <Box
          as="ul"
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            mb: 4,
            height: 376,
            overflowY: "auto",
            border: "1px solid",
            borderColor: "border.default",
            borderRadius: 2,
          }}
        >
          {loading && !mergedProducts.length && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: "auto",
                width: "100%",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Spinner />
            </Box>
          )}

          {mergedProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              isSelected={selected.includes(product.id)}
              onSelect={() => handleSelect(product.id)}
            />
          ))}
        </Box>

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={(_, page) => setCurrentPage(page)}
            showPages
          />
        )}

        <Button
          variant="primary"
          disabled={selected.length === 0}
          onClick={handleSubmit}
          size="large"
        >
          Submit
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default ProductSelector;
