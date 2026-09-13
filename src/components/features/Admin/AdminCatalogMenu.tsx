import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useCategories";
import { flattenCategoryTree } from "@/lib/category-utils";

export const AdminCatalogMenu = () => {
  const navigate = useNavigate();
  const { catalogCategories, fetchCatalogCategories } = useCategories();

  useEffect(() => {
    void fetchCatalogCategories();
  }, [fetchCatalogCategories]);

  const categories = flattenCategoryTree(catalogCategories).filter(
    (category) => (category.products?.length ?? 0) > 0,
  );

  if (categories.length === 0) return null;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Catálogo</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => navigate(`/catalogo/${category.id}`)}
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
