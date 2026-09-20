import { Pagination } from "@/types/pagination";

// URLs base y endpoints de la API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    CHANGE_PASSWORD: (id: string) => `/api/auth/change-password/${id}`,
    UPDATE_PROFILE: (id: string) => `/api/auth/profile/${id}`,
  },

  // Projects
  PROJECTS: {
    LIST: (page: number, limit: number) =>
      `/api/projects?page=${page}&limit=${limit}`,
    CREATE: "/api/projects",
    DETAIL: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
    ADD_MEMBER: (id: string) => `/api/projects/${id}/members`,
    REMOVE_MEMBER: (id: string, memberId: string) =>
      `/api/projects/${id}/members/${memberId}`,
  },

  // Tasks
  TASKS: {
    LIST: (projectId: string, page: number, limit: number) =>
      `/api/tasks/project/${projectId}?page=${page}&limit=${limit}`,
    CREATE: "/api/tasks",
    DETAIL: (id: string) => `/api/tasks/${id}`,
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
    UPDATE_STATUS: (id: string) => `/api/tasks/${id}/status`,
    UPDATE_PRIORITY: (id: string) => `/api/tasks/${id}/priority`,
  },

  // Users
  USERS: {
    LIST: (pagination: Pagination) =>
      `/api/users?limit=${pagination.limit}&page=${pagination.page}`,
    DETAIL: (id: string) => `/api/users/${id}`,
    CREATE: "/api/users",
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },

  CATEGORIES: {
    LIST: "/api/categories",
    TREE: "/api/categories",
    DETAIL: (id: string) => `/api/categories/${id}`,
    CREATE: "/api/categories",
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
    WITH_PRODUCTS: () => `/api/categories/with-products`,
  },
  PRODUCTS: {
    LIST: "/api/products",
    DETAIL: (id: string) => `/api/products/${id}`,
    CREATE: "/api/products",
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
  },
  BANNERS: {
    LIST: "/api/banners",
    DETAIL: (id: string) => `/api/banners/${id}`,
    CREATE: "/api/banners",
    UPDATE: (id: string) => `/api/banners/${id}`,
    DELETE: (id: string) => `/api/banners/${id}`,
  },
  INFORMATION: {
    LIST: "/api/information",
    CREATE: "/api/information",
    UPDATE: (id: string) => `/api/information/${id}`,
    DETAIL: (id: string) => `/api/information/${id}`,
  },
  ABOUT: {
    LIST: "/api/about",
    CREATE: "/api/about",
    UPDATE: (id: string) => `/api/about/${id}`,
    DETAIL: (id: string) => `/api/about/${id}`,
  },
  UPLOAD: {
    IMAGE: "/api/upload/image",
  },
  // Orders
  ORDERS: {
    LIST: "/api/orders",
    MY_ORDERS: (userId: string) => `/api/orders/me/${userId}`,
    DETAIL: (id: string) => `/api/orders/${id}`,
    MY_ORDER: (id: string, userId: string) => `/api/orders/me/${id}/${userId}`,
    CREATE: (userId: string) => `/api/orders/${userId}`,
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    CANCEL: (id: string, userId?: string) =>
      userId
        ? `/api/orders/me/${id}/${userId}/cancel`
        : `/api/orders/${id}/cancel`,
  },
  // Payments
  PAYMENTS: {
    CREDIT_CARD: "/api/payments/credit-card",
  },
  REPORTS: {
    ORDERS: "/api/reports/orders",
    ORDERS_LIST: "/api/reports/orders/list",
    SALES: "/api/reports/sales",
    SALES_LIST: "/api/reports/sales/list",
  },
};
