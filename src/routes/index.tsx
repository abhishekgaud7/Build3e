import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Layout } from "../components/layout/Layout";
import { PitchPage } from "./pitch";
import { LoginPage } from "./login";
import { RegisterPage } from "./register";
import { HomePage } from "./home";
import { ProductsPage } from "./products";
import { ProductDetailPage } from "./product-detail";
import { CategoriesPage } from "./categories";
import { CartPage } from "./cart";
import { CheckoutPage } from "./checkout";
import { OrdersPage } from "./orders";
import { OrderDetailPage } from "./order-detail";
import { ProfilePage } from "./profile";
import { AddressesPage } from "./addresses";
import { SupportPage } from "./support";
import { SupportDetailPage } from "./support-detail";

export const router = createBrowserRouter([
  {
    path: "/pitch",
    element: <PitchPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "categories/:slug",
        element: <ProductsPage />,
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "addresses",
        element: (
          <ProtectedRoute>
            <AddressesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "support",
        element: (
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "support/:id",
        element: (
          <ProtectedRoute>
            <SupportDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <div className="flex items-center justify-center min-h-screen">404 - Page Not Found</div>,
  },
]);