import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  // DropdownMenuShortcut,
  // DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AdminCatalogMenu } from "./AdminCatalogMenu";
import { hasUserRole } from "@/utils/roles";

export const AdminMenuComponent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = hasUserRole(user, "admin");
  const canAccessCatalog = isAdmin || hasUserRole(user, "seller");

  if (!isAuthenticated || !canAccessCatalog) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <div className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer">
            <span className="text-sm font-medium">Administración</span>
          </div>
        }
      />
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          {isAdmin && (
            <>
              <DropdownMenuItem onClick={() => navigate("/users-admin")}>
                Usuarios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/categories-admin")}>
                Categorías
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/products-admin")}>
                Productos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/banners-admin")}>
                Banners
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/orders-admin")}>
                Ordenes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/information-admin")}>
                Información
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/about-admin")}>
                Acerca de Nosotros
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/qr-admin")}>
                Genere QR
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/reports-admin")}>
                Reportes
              </DropdownMenuItem>
            </>
          )}
          {canAccessCatalog && <AdminCatalogMenu />}
          
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
