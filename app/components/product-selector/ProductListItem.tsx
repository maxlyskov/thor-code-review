import { Box, Text } from "@primer/react";
import type { Product } from "~/types";

export const ProductListItem = ({
  product,
  isSelected,
  onSelect,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <Box
    as="li"
    onClick={onSelect}
    sx={{
      p: 3,
      borderBottom: "1px solid",
      borderColor: "border.muted",
      cursor: "pointer",
      bg: isSelected ? "accent.subtle" : "canvas.default",
      "&:hover": { bg: "neutral.subtle" },
      userSelect: "none",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Text sx={{ fontWeight: "bold" }}>{product.name}</Text>
    <Text sx={{ fontSize: 0, color: "fg.muted" }}>ID: {product.id}</Text>
  </Box>
);
