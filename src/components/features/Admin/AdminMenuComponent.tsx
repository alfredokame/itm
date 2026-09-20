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

export const AdminMenuComponent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user?.role?.includes("admin")) {
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
          <DropdownMenuItem onClick={() => navigate("/users-admin")}>
            Usuarios
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/categories-admin")}>
            Categorías
            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/products-admin")}>
            Productos
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/banners-admin")}>
            Banners
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/orders-admin")}>
            Ordenes
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
