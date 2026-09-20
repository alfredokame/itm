import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportListSection } from "@/components/reports/ReportListSection";
import { ReportSummaryCard } from "@/components/reports/ReportSummaryCard";
import { useReportLists } from "@/hooks/useReportLists";
import { useReportUsers } from "@/hooks/useReportUsers";
import { useReports } from "@/hooks/useReports";
import type {
  ReportFilters as ReportFiltersType,
  ReportPeriod,
} from "@/types/report.types";
import { toUtcIso } from "@/utils/report.utils";

export const ReportsPage = () => {
  const {
    ordersReport,
    salesReport,
    isLoading,
    error,
    filters,
    fetchReports,
    setFilters,
  } = useReports();
  const { users, isLoading: isLoadingUsers, error: usersError } = useReportUsers();
  const { orders, sales, loadOrders, loadSales } = useReportLists(filters);
  const [form, setForm] = useState<ReportFiltersType>(filters);
  const [customRange, setCustomRange] = useState(false);

  useEffect(() => {
    void fetchReports(filters);
  }, [fetchReports, filters]);

  const updateForm = <K extends keyof ReportFiltersType>(
    key: K,
    value: ReportFiltersType[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handlePeriodChange = (period: ReportPeriod) => {
    setCustomRange(false);
    setForm((current) => ({
      ...current,
      period,
      from: undefined,
      to: undefined,
    }));
  };

  const handleCustomRangeChange = () => {
    setCustomRange((current) => !current);
    setForm((current) => ({
      ...current,
      from: undefined,
      to: undefined,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters(
      customRange
        ? {
            period: form.period,
            from: form.from ? toUtcIso(form.from) : undefined,
            to: form.to ? toUtcIso(form.to) : undefined,
            sellerId: form.sellerId?.trim() || undefined,
          }
        : {
            period: form.period,
            date: form.date,
            sellerId: form.sellerId?.trim() || undefined,
          },
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <header>
          <h1 className="text-2xl font-semibold">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Consulta pedidos registrados y ventas pagadas por período.
          </p>
        </header>

        <ReportFilters
          value={form}
          users={users}
          isLoadingUsers={isLoadingUsers}
          usersError={usersError}
          isLoadingReports={isLoading}
          customRange={customRange}
          onChange={updateForm}
          onPeriodChange={handlePeriodChange}
          onCustomRangeChange={handleCustomRangeChange}
          onSubmit={handleSubmit}
        />

        {isLoading ? (
          <DataStateSkeleton variant="table" count={5} />
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => void fetchReports(filters)}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <section aria-labelledby="reports-summary-title">
              <h2 id="reports-summary-title" className="mb-3 text-lg font-semibold">
                Resumen
              </h2>
              <div className="grid gap-6 xl:grid-cols-2">
                <ReportSummaryCard title="Pedidos" report={ordersReport} />
                <ReportSummaryCard title="Ventas pagadas" report={salesReport} />
              </div>
            </section>

            <ReportListSection
              title="Listado de pedidos"
              description="Pedidos que coinciden con los filtros aplicados."
              kind="orders"
              data={orders.data?.data ?? []}
              pagination={orders.data?.pagination ?? null}
              isLoading={orders.isLoading}
              error={orders.error}
              onPageChange={(page) => void loadOrders(page)}
            />
            <ReportListSection
              title="Listado de ventas pagadas"
              description="Ventas pagadas que coinciden con los filtros aplicados."
              kind="sales"
              data={sales.data?.data ?? []}
              pagination={sales.data?.pagination ?? null}
              isLoading={sales.isLoading}
              error={sales.error}
              onPageChange={(page) => void loadSales(page)}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
