import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useLocation,
  // useNavigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
// import { AUTH_EXPIRED_EVENT } from "@/utils/authEvents";

// Páginas de Autenticación
import RegisterPage from "@/pages/Auth/RegisterPage";
import LoginPage from "@/pages/Auth/LoginPage";
import ProfilePage from "@/pages/Auth/Profile";

// Páginas Principales
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/Home/HomePage";

import AllProducts from "@/pages/Products/AllProducts";
import ProductDetails from "@/pages/Products/ProductDetails";
import About from "@/pages/About/AboutPage";
import CartPage from "@/pages/Cart/CartPage";
import ChangePasswordPage from "@/pages/Auth/ChangePasswordPage";
import OrdersPage from "@/pages/Orders/OrdersPage";
import OrderDetailPage from "@/pages/Orders/OrderDetailPage";
import { ProductsPage } from "@/pages/Admin/Product/Products";
import { UsersPageAdmin } from "@/pages/Admin/User/Users";
import { OrdersPageAdmin } from "@/pages/Admin/Orders";
import CategoriesPage from "@/pages/Admin/Category/Categories";
import BannersPage from "@/pages/Admin/Banners";
import MyOrdersPage from "@/pages/Auth/MyOrders";
import InformationPage from "@/pages/Admin/Information";
import { QrGeneratorPage } from "@/pages/Admin/QrGenerator";
import AboutAdminPage from "@/pages/Admin/About";
import CatalogCategoryPage from "@/pages/Admin/Catalog/CatalogCategory";
import { hasUserRole } from "@/utils/roles";

// Componente para proteger rutas
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.role?.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const CatalogProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasUserRole(user, "admin") && !hasUserRole(user, "seller")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Componente para rutas públicas (redirige si está autenticado)
// interface PublicRouteProps {
//   children: React.ReactNode;
// }

// const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// const AuthRedirectHandler = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleAuthExpired = () => {
//       if (location.pathname !== "/login" && location.pathname !== "/register") {
//         navigate("/login", { replace: true });
//       }
//     };

//     window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

//     return () => {
//       window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
//     };
//   }, [location.pathname, navigate]);

//   return null;
// };

function RoutesComponents() {
  return (
    <Router>
      {/* <AuthRedirectHandler /> */}
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:isWholesale?" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Rutas Protegidas */}
        {/* <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me/orders/:id"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        {/*Rutas para usuarios administradores de la tienda  */}
        <Route
          path="/categories-admin"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products-admin"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/catalogo/:categoryId"
          element={
            <CatalogProtectedRoute>
              <CatalogCategoryPage />
            </CatalogProtectedRoute>
          }
        />

        <Route
          path="/orders-admin"
          element={
            <ProtectedRoute>
              <OrdersPageAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/banners-admin"
          element={
            <ProtectedRoute>
              <BannersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users-admin"
          element={
            <ProtectedRoute>
              <UsersPageAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/information-admin"
          element={
            <ProtectedRoute>
              <InformationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about-admin"
          element={
            <AdminProtectedRoute>
              <AboutAdminPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/qr-admin"
          element={
            <AdminProtectedRoute>
              <QrGeneratorPage />
            </AdminProtectedRoute>
          }
        />

        {/* Rutas Especiales */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default RoutesComponents;
