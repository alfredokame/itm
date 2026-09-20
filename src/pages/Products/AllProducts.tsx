import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/features/Product/ProductCard";
import { ProductFilters } from "@/components/forms/Admin/Productos/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";
import { useParams } from "react-router-dom";

const AllProducts = () => {
  const {
    products,
    fetchProducts,
    isLoading,
    pagination,
    setPage,
    setLimit,
    setFilters,
  } = useProducts();

  const { isWholesale } = useParams<{ isWholesale?: string }>();

  const isWholesaleMode = isWholesale === "true";

  const pageTitle = isWholesaleMode
    ? "Ventas por Parlet"
    : "Productos Caja";

  useEffect(() => {
    setFilters({ isWholesale: isWholesaleMode });
    void fetchProducts();
  }, [fetchProducts, isWholesaleMode, setFilters]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{pageTitle}</h1>

        <div className="mb-8 flex justify-center">
          <ProductFilters />
        </div>

        {isLoading ? (
          <div className="py-8">
            <DataStateSkeleton
              variant="cards"
              count={8}
              className="mx-auto max-w-7xl"
            />
          </div>
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
              onPageChange={(page) => setPage(page)}
              onItemsPerPageChange={(limit) => setLimit(limit)}
              className="mt-8"
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AllProducts;
