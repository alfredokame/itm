import { useCallback, useEffect, useState } from "react";
import { reportsService } from "@/api/services/reports.service";
import type {
  PaginatedListResponse,
  ReportFilters,
  ReportOrderDetail,
  ReportSaleDetail,
} from "@/types/report.types";
import { getListDateFilters } from "@/utils/report.utils";

const LIST_LIMIT = 10;

type ReportListState<T> = {
  data: PaginatedListResponse<T> | null;
  isLoading: boolean;
  error: string | null;
};

const initialState = <T>(): ReportListState<T> => ({
  data: null,
  isLoading: false,
  error: null,
});

export const useReportLists = (filters: ReportFilters) => {
  const [orders, setOrders] =
    useState<ReportListState<ReportOrderDetail>>(initialState);
  const [sales, setSales] =
    useState<ReportListState<ReportSaleDetail>>(initialState);
  const [isExporting, setIsExporting] = useState(false);

  const loadOrders = useCallback(
    async (page: number) => {
      setOrders((current) => ({
        ...current,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await reportsService.getOrdersList({
          ...getListDateFilters(filters),
          sellerId: filters.sellerId,
          page,
          limit: LIST_LIMIT,
        });
        setOrders({ data: response.data, isLoading: false, error: null });
      } catch (loadError) {
        setOrders((current) => ({
          ...current,
          isLoading: false,
          error:
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los pedidos",
        }));
      }
    },
    [filters],
  );

  const loadSales = useCallback(
    async (page: number) => {
      setSales((current) => ({
        ...current,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await reportsService.getSalesList({
          ...getListDateFilters(filters),
          sellerId: filters.sellerId,
          page,
          limit: LIST_LIMIT,
        });
        setSales({ data: response.data, isLoading: false, error: null });
      } catch (loadError) {
        setSales((current) => ({
          ...current,
          isLoading: false,
          error:
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar las ventas",
        }));
      }
    },
    [filters],
  );

  const loadAllReports = useCallback(async () => {
    const limit = 100;
    const allOrders: ReportOrderDetail[] = [];
    const allSales: ReportSaleDetail[] = [];

    for (let page = 1; ; page += 1) {
      const response = await reportsService.getOrdersList({
        ...getListDateFilters(filters),
        sellerId: filters.sellerId,
        page,
        limit,
      });
      allOrders.push(...response.data.data);

      if (page >= response.data.pagination.totalPages) {
        break;
      }
    }

    for (let page = 1; ; page += 1) {
      const response = await reportsService.getSalesList({
        ...getListDateFilters(filters),
        sellerId: filters.sellerId,
        page,
        limit,
      });
      allSales.push(...response.data.data);

      if (page >= response.data.pagination.totalPages) {
        break;
      }
    }

    return { orders: allOrders, sales: allSales };
  }, [filters]);

  const exportReports = useCallback(async () => {
    setIsExporting(true);
    try {
      return await loadAllReports();
    } finally {
      setIsExporting(false);
    }
  }, [loadAllReports]);

  useEffect(() => {
    void Promise.all([loadOrders(1), loadSales(1)]);
  }, [loadOrders, loadSales]);

  return {
    orders,
    sales,
    loadOrders,
    loadSales,
    exportReports,
    isExporting,
  };
};
