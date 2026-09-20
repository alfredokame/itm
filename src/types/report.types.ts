export type ReportPeriod = "day" | "month" | "year";

export interface ReportFilters {
  period: ReportPeriod;
  date?: string;
  from?: string;
  to?: string;
  sellerId?: string;
}

export interface ReportRow {
  periodStart: string;
  count: number;
  totalAmount: number;
}

export interface ReportTotals {
  count: number;
  totalAmount: number;
}

export interface ReportOrderDetail {
  id: string;
  createdAt: string;
  status: string;
  deliveryMethod: "delivery" | "pickup";
  deliveryAddress?: string;
  totalPrice: string | number;
  user?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  items?: Array<{
    id: string;
    quantity: number;
    unitPrice: string | number;
    product?: {
      name?: string;
    };
  }>;
}

export interface ReportSaleDetail {
  id: string;
  orderReference?: string;
  createdAt: string;
  paidAt?: string;
  status?: string;
  amount: number | string;
  currency?: string;
  transactionId?: string;
  reference?: string;
  user?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  order?: ReportOrderDetail;
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
}

export interface ReportResponse<TDetail> {
  period: ReportPeriod;
  from: string;
  to: string;
  sellerId?: string;
  data: ReportRow[];
  totals: ReportTotals;
  details: TDetail[];
}

export interface OrdersListFilters {
  page?: number;
  limit?: number;
  sellerId?: string;
  orderId?: string;
  status?: string;
  deliveryMethod?: "delivery" | "pickup";
  email?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface SalesListFilters {
  page?: number;
  limit?: number;
  sellerId?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedListResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ReportsStore {
  ordersReport: ReportResponse<ReportOrderDetail> | null;
  salesReport: ReportResponse<ReportSaleDetail> | null;
  isLoading: boolean;
  error: string | null;
  filters: ReportFilters;
  fetchReports: (filters: ReportFilters) => Promise<void>;
  setFilters: (filters: ReportFilters) => void;
  clearError: () => void;
}
