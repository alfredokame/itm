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

  useEffect(() => {
    void Promise.all([loadOrders(1), loadSales(1)]);
  }, [loadOrders, loadSales]);

  return {
    orders,
    sales,
    loadOrders,
    loadSales,
  };
};
