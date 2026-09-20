import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  ReportFilters,
  ReportOrderDetail,
  ReportResponse,
  ReportSaleDetail,
  OrdersListFilters,
  SalesListFilters,
  PaginatedListResponse,
} from "@/types/report.types";

const buildParams = (filters: ReportFilters) => {
  const params = {
    period: filters.period,
    date: filters.date,
    from: filters.from,
    to: filters.to,
    sellerId: filters.sellerId,
  };

  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

const buildListParams = (filters: OrdersListFilters | SalesListFilters) => {
  const params: Record<string, unknown> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    sellerId: filters.sellerId,
  };

  // Filtros comunes para orders
  if ("orderId" in filters && filters.orderId) {
    params.orderId = filters.orderId;
  }
  if ("status" in filters && filters.status) {
    params.status = filters.status;
  }
  if ("deliveryMethod" in filters && filters.deliveryMethod) {
    params.deliveryMethod = filters.deliveryMethod;
  }
  if ("email" in filters && filters.email) {
    params.email = filters.email;
  }
  if ("createdAfter" in filters && filters.createdAfter) {
    params.createdAfter = filters.createdAfter;
  }
  if ("createdBefore" in filters && filters.createdBefore) {
    params.createdBefore = filters.createdBefore;
  }

  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
};

const getReport = async <TDetail>(
  endpoint: string,
  filters: ReportFilters,
): Promise<ReportResponse<TDetail>> => {
  const response = await axiosClient.get<ReportResponse<TDetail>>(endpoint, {
    params: buildParams(filters),
  });
  return {
    ...response.data,
    details: Array.isArray(response.data.details) ? response.data.details : [],
  };
};

export const reportsService = {
  getOrders: (filters: ReportFilters) =>
    getReport<ReportOrderDetail>(ENDPOINTS.REPORTS.ORDERS, filters),
  getSales: (filters: ReportFilters) =>
    getReport<ReportSaleDetail>(ENDPOINTS.REPORTS.SALES, filters),

  getOrdersList: (filters: OrdersListFilters) =>
    axiosClient.get<PaginatedListResponse<ReportOrderDetail>>(
      ENDPOINTS.REPORTS.ORDERS_LIST,
      {
        params: buildListParams(filters),
      },
    ),

  getSalesList: (filters: SalesListFilters) =>
    axiosClient.get<PaginatedListResponse<ReportSaleDetail>>(
      ENDPOINTS.REPORTS.SALES_LIST,
      {
        params: buildListParams(filters),
      },
    ),
};
