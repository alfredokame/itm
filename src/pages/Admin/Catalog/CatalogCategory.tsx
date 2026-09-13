import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/features/Product/ProductCard";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";
import { PaginationControls } from "@/components/common/PaginationControls";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

const CatalogCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { catalogCategories, fetchCatalogCategories } = useCategories();
  const {
    products,
    error,
    isLoading,
    pagination,
    setFilters,
    setPage,
    setLimit,
  } = useProducts();

  const category = catalogCategories
    .flatMap((item) => [item, ...(item.children ?? [])])
    .find((item) => item.id === categoryId);

  useEffect(() => {
    void fetchCatalogCategories();
  }, [fetchCatalogCategories]);

  useEffect(() => {
    if (categoryId) setFilters({ categoryId, isWholesale: undefined });
  }, [categoryId, setFilters]);

  useEffect(() => {
    document.title = category?.name ?? "Catálogo";
  }, [category?.name]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
          {category?.name ?? "Catálogo"}
        </h1>

        {isLoading ? (
          <DataStateSkeleton variant="cards" count={8} />
        ) : error ? (
          <p className="py-8 text-center text-red-600">
            No se pudieron cargar los productos de esta categoría.
          </p>
        ) : products.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            Esta categoría no tiene productos disponibles.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.images?.[0] ?? "/banners-home/8pm.jpg"}
                  stock={product.stock}
                />
              ))}
            </div>
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages || 1}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
              onPageChange={setPage}
              onItemsPerPageChange={setLimit}
              className="mt-8"
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default CatalogCategoryPage;
