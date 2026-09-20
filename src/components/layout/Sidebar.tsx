import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import Button from "../common/Button";
import cn from "../../utils/cn";
import { useCategories } from "@/hooks/useCategories";
import { flattenCategoryTree } from "@/lib/category-utils";
import { hasUserRole } from "@/utils/roles";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuth();
  const { catalogCategories, fetchCatalogCategories } = useCategories();
  const isAdmin = hasUserRole(user, "admin");
  const canAccessCatalog = isAdmin || hasUserRole(user, "seller");

  useEffect(() => {
    if (canAccessCatalog) void fetchCatalogCategories();
  }, [canAccessCatalog, fetchCatalogCategories]);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos Caja" },
    { href: "/products/true", label: "Ventas por Parlet" },
    { href: "/about", label: "Sobre nosotros" },
  ];

  const accountLinks = isAuthenticated
    ? [
        { href: "/profile", label: "Perfil" },
        { href: `/me/orders/${user?.id}`, label: "Mis pedidos" },
        { href: "/change-password", label: "Cambiar contraseña" },
      ]
    : [
        { href: "/login", label: "Acceder" },
        { href: "/register", label: "Crear cuenta" },
      ];

  const adminLinks = isAdmin
    ? [
        { href: "/users-admin", label: "Usuarios" },
        { href: "/categories-admin", label: "Categorías" },
        { href: "/products-admin", label: "Productos" },
        { href: "/banners-admin", label: "Banners" },
        { href: "/orders-admin", label: "Órdenes" },
        { href: "/qr-admin", label: "Genere QR" },
        { href: "/about-admin", label: "Acerca de Nosotros" },
        { href: "/reports-admin", label: "Reportes" },
      ]
    : [];

  const handleNavigation = (href: string) => {
    setSidebarOpen(false);
    navigate(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-input bg-background shadow-xl transition-transform duration-300 md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Encabezado fijo */}
          <div className="flex shrink-0 items-center justify-between border-b border-input p-4">
            <div>
              <p className="text-lg font-semibold text-slate-900">IberoMax</p>
              <p className="text-sm text-slate-500">Navegación</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-slate-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4">
            <nav className="space-y-1">
              {navLinks.map(({ href, label }) => (
                <button
                  key={href}
                  type="button"
                  onClick={() => handleNavigation(href)}
                  className={cn(
                    "w-full text-left rounded-lg px-4 py-3 transition-colors",
                    location.pathname === href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-6 border-t border-input pt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Cuenta
              </p>

              <nav className="space-y-1">
                {accountLinks.map(({ href, label }) => (
                  <button
                    key={href}
                    type="button"
                    onClick={() => handleNavigation(href)}
                    className={cn(
                      "w-full text-left rounded-lg px-4 py-3 transition-colors",
                      location.pathname === href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {label}
                  </button>
                ))}

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setSidebarOpen(false);
                      logout();
                    }}
                    className="w-full text-left rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-muted"
                  >
                    Cerrar sesión
                  </button>
                )}
              </nav>
            </div>

            {(adminLinks.length > 0 || canAccessCatalog) && (
              <div className="mt-6 border-t border-input pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Administración
                </p>

                <nav className="space-y-1">
                  {adminLinks.map(({ href, label }) => (
                    <button
                      key={href}
                      type="button"
                      onClick={() => handleNavigation(href)}
                      className={cn(
                        "w-full text-left rounded-lg px-4 py-3 transition-colors",
                        location.pathname === href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
                {canAccessCatalog &&
                  flattenCategoryTree(catalogCategories).filter(
                    (category) => (category.products?.length ?? 0) > 0,
                  ).length > 0 && (
                    <>
                      <p className="px-4 py-3 font-medium text-foreground">
                        Catálogo
                      </p>
                      {flattenCategoryTree(catalogCategories)
                        .filter(
                          (category) => (category.products?.length ?? 0) > 0,
                        )
                        .map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() =>
                              handleNavigation(`/catalogo/${category.id}`)
                            }
                            className="w-full rounded-lg px-4 py-3 pl-8 text-left text-foreground transition-colors hover:bg-muted"
                          >
                            {category.name}
                          </button>
                        ))}
                    </>
                  )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
