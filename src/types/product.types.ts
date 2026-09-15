export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: string | ProductCategory;
  images: string[];
  image?: string;
  createdAt: string;
  updatedAt: string;
  year?: number;
  slug?: string;
  sku?: string;
  status?: "active" | "inactive";
  isWholesale?: boolean;
  saleUnit?: ProductSaleUnit;
}

export type ProductSaleUnit = "BOX" | "PALLET";

export type CreateProductPayload = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: string[];
  isWholesale?: boolean;
  saleUnit?: ProductSaleUnit;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ProductFilters {
  isWholesale?: boolean;
  saleUnit?: ProductSaleUnit;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
