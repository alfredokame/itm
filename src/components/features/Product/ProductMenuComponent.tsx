import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  // DropdownMenuShortcut,
  // DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const ProductMenuComponent = () => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <div className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer">
            <span className="text-sm font-medium">Productos</span>
          </div>
        }
      />
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/products")}>
            Venta por Caja
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/products/true")}>
            Venta por Parlet
            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
