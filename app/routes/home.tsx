import { ProductSelector } from "~/components/product-selector";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const handleSubmit = (ids: string | string[]) => {
    console.log("Selected product IDs:", ids);
  };

  return (
    <div>
      <ProductSelector
        selectedIds={["product_01jdyxsjmve4atdr94bv0vvjvc"]}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
