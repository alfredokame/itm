import { create } from "zustand";
import { reportsService } from "@/api/services/reports.service";
import type {
  ReportFilters,
  ReportsStore,
} from "@/types/report.types";

const defaultFilters: ReportFilters = {
  period: "day",
  date: new Date().toISOString().slice(0, 10),
};

export const useReportsStore = create<ReportsStore>((set) => ({
  ordersReport: null,
  salesReport: null,
  isLoading: false,
  error: null,
  filters: defaultFilters,

  fetchReports: async (filters) => {
    set({ isLoading: true, error: null, filters });

    try {
      const [ordersReport, salesReport] = await Promise.all([
        reportsService.getOrders(filters),
        reportsService.getSales(filters),
      ]);

      set({
        ordersReport,
        salesReport,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los reportes",
      });
    }
  },

  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));
