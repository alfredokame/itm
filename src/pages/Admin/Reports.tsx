import { useCallback, useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/common/PaginationControls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReports } from "@/hooks/useReports";
import { reportsService } from "@/api/services/reports.service";
import { usersService } from "@/api/services/users.service";
import type {
  ReportOrderDetail,
  ReportFilters,
  ReportPeriod,
  ReportResponse,
  ReportSaleDetail,
  PaginatedListResponse,
} from "@/types/report.types";
import type { User } from "@/types/user.types";

const periodLabels: Record<ReportPeriod, string> = {
  day: "Día",
  month: "Mes",
  year: "Año",
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatPeriod = (value: string, period: ReportPeriod) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: period === "day" ? "medium" : "long",
  }).format(new Date(value));

const toUtcIso = (value: string) => {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
};

const getListDateFilters = (filters: ReportFilters) => {
  if (filters.from || filters.to) {
    return {
      createdAfter: filters.from,
      createdBefore: filters.to,
    };
  }

  if (!filters.date) {
    return {};
  }

  const start = new Date(`${filters.date}T00:00:00.000Z`);
  if (filters.period === "month") {
    start.setUTCDate(1);
  } else if (filters.period === "year") {
    start.setUTCMonth(0, 1);
  }

  const end = new Date(start);
  if (filters.period === "year") {
    end.setUTCFullYear(end.getUTCFullYear() + 1);
  } else if (filters.period === "month") {
    end.setUTCMonth(end.getUTCMonth() + 1);
  } else {
    end.setUTCDate(end.getUTCDate() + 1);
  }

  return {
    createdAfter: start.toISOString(),
    createdBefore: end.toISOString(),
  };
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getCustomerName = (detail: ReportOrderDetail) =>
  detail.user?.fullName ||
  `${detail.user?.firstName ?? ""} ${detail.user?.lastName ?? ""}`.trim() ||
  detail.user?.email ||
  "Cliente";

const getSaleCustomerName = (detail: ReportSaleDetail) =>
  detail.customerName ||
  detail.user?.fullName ||
  `${detail.user?.firstName ?? ""} ${detail.user?.lastName ?? ""}`.trim() ||
  detail.customerEmail ||
  detail.user?.email ||
  "Cliente";

const getStatusLabel = (status?: string) => {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    ready_for_pickup: "Listo para recoger",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    paid: "Pagada",
    completed: "Completada",
  };

  return status ? labels[status] ?? status : "—";
};

type ReportDetailsTableProps =
  | { kind: "orders"; details: ReportOrderDetail[] }
  | { kind: "sales"; details: ReportSaleDetail[] };

const ReportDetailsTable = ({ kind, details }: ReportDetailsTableProps) => {
  if (!details.length) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No hay registros detallados para los filtros seleccionados.
      </p>
    );
  }

  if (kind === "orders") {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Entrega</TableHead>
            <TableHead className="text-right">Productos</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{formatDateTime(order.createdAt)}</TableCell>
              <TableCell>
                <div>{getCustomerName(order)}</div>
                {order.user?.email && (
                  <div className="text-xs text-muted-foreground">
                    {order.user.email}
                  </div>
                )}
              </TableCell>
              <TableCell>{getStatusLabel(order.status)}</TableCell>
              <TableCell>
                {order.deliveryMethod === "delivery" ? "Domicilio" : "Recogida"}
              </TableCell>
              <TableCell className="text-right">
                {order.items?.reduce((total, item) => total + item.quantity, 0) ??
                  0}
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(Number(order.totalPrice) || 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Venta</TableHead>
          <TableHead>Pedido</TableHead>
          <TableHead>Fecha de pago</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Referencia</TableHead>
          <TableHead>Moneda</TableHead>
          <TableHead className="text-right">Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {details.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">#{sale.id}</TableCell>
            <TableCell>
              {sale.orderReference
                ? `#${sale.orderReference}`
                : sale.orderId
                  ? `#${sale.orderId}`
                  : "—"}
            </TableCell>
            <TableCell>{formatDateTime(sale.paidAt ?? sale.createdAt)}</TableCell>
            <TableCell>
              <div>{getSaleCustomerName(sale)}</div>
              {(sale.customerEmail || sale.user?.email) && (
                <div className="text-xs text-muted-foreground">
                  {sale.customerEmail || sale.user?.email}
                </div>
              )}
            </TableCell>
            <TableCell>{getStatusLabel(sale.status)}</TableCell>
            <TableCell>{sale.reference || sale.transactionId || "—"}</TableCell>
            <TableCell>{sale.currency || "—"}</TableCell>
            <TableCell className="text-right">
              {formatAmount(Number(sale.amount) || 0)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ListStateMessage = ({
  isLoading,
  error,
  isEmpty,
}: {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}) => {
  if (isLoading) {
    return <DataStateSkeleton variant="table" count={4} />;
  }

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (isEmpty) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No hay registros para los filtros seleccionados.
      </p>
    );
  }

  return null;
};

const ReportCard = ({
  title,
  report,
}: {
  title: string;
  report: ReportResponse<ReportOrderDetail> | ReportResponse<ReportSaleDetail> | null;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Registros</p>
            <p className="text-2xl font-semibold">{report?.totals.count ?? 0}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Monto total</p>
            <p className="text-2xl font-semibold">
              {formatAmount(report?.totals.totalAmount ?? 0)}
            </p>
          </div>
        </div>

        {!report?.data.length ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No hay datos para el período seleccionado.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Registros</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.data.map((row) => (
                <TableRow key={row.periodStart}>
                  <TableCell>
                    {formatPeriod(row.periodStart, report.period)}
                  </TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                  <TableCell className="text-right">
                    {formatAmount(row.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

      </CardContent>
    </Card>
  );
};

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
  const [form, setForm] = useState<ReportFilters>(filters);
  const [customRange, setCustomRange] = useState(false);
  const [ordersList, setOrdersList] =
    useState<PaginatedListResponse<ReportOrderDetail> | null>(null);
  const [salesList, setSalesList] =
    useState<PaginatedListResponse<ReportSaleDetail> | null>(null);
  const [ordersListLoading, setOrdersListLoading] = useState(false);
  const [salesListLoading, setSalesListLoading] = useState(false);
  const [ordersListError, setOrdersListError] = useState<string | null>(null);
  const [salesListError, setSalesListError] = useState<string | null>(null);
  const [sellerUsers, setSellerUsers] = useState<User[]>([]);
  const [isLoadingSellers, setIsLoadingSellers] = useState(false);
  const [sellersError, setSellersError] = useState<string | null>(null);
  const listLimit = 10;

  useEffect(() => {
    const loadSellerUsers = async () => {
      setIsLoadingSellers(true);
      setSellersError(null);

      try {
        const response = await usersService.getAll({ page: 1, limit: 100 });
        const sellers = response.data.filter(
          (user) =>
            user.roles?.some(
              (role) => role.name.toLowerCase() === "seller",
            ),
        );
        setSellerUsers(sellers);
      } catch (error) {
        setSellersError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los vendedores",
        );
      } finally {
        setIsLoadingSellers(false);
      }
    };

    void loadSellerUsers();
  }, []);

  useEffect(() => {
    void fetchReports(filters);
  }, [fetchReports, filters]);

  const loadOrdersList = useCallback(
    async (page: number) => {
      setOrdersListLoading(true);
      setOrdersListError(null);
      setOrdersList(null);

      try {
        const response = await reportsService.getOrdersList({
          ...getListDateFilters(filters),
          sellerId: filters.sellerId,
          page,
          limit: listLimit,
        });
        setOrdersList(response.data);
      } catch (error) {
        setOrdersListError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los pedidos",
        );
      } finally {
        setOrdersListLoading(false);
      }
    },
    [filters],
  );

  const loadSalesList = useCallback(
    async (page: number) => {
      setSalesListLoading(true);
      setSalesListError(null);
      setSalesList(null);

      try {
        const response = await reportsService.getSalesList({
          ...getListDateFilters(filters),
          sellerId: filters.sellerId,
          page,
          limit: listLimit,
        });
        setSalesList(response.data);
      } catch (error) {
        setSalesListError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las ventas",
        );
      } finally {
        setSalesListLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void Promise.all([loadOrdersList(1), loadSalesList(1)]);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadOrdersList, loadSalesList]);

  const updateForm = <K extends keyof ReportFilters>(
    key: K,
    value: ReportFilters[K],
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFilters: ReportFilters = customRange
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
        };
        setFilters(nextFilters);
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-2xl font-semibold">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Consulta pedidos registrados y ventas pagadas por período.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
            >
              <label className="space-y-2 text-sm font-medium">
                Agrupar por
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={form.period}
                  onChange={(event) =>
                    handlePeriodChange(event.target.value as ReportPeriod)
                  }
                >
                  {Object.entries(periodLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium">
                {customRange ? "Desde" : "Fecha"}
                <Input
                  type="date"
                  value={customRange ? (form.from ?? "") : (form.date ?? "")}
                  onChange={(event) =>
                    updateForm(
                      customRange ? "from" : "date",
                      event.target.value,
                    )
                  }
                  required
                />
              </label>

              {customRange ? (
                <label className="space-y-2 text-sm font-medium">
                  Hasta
                  <Input
                    type="date"
                    value={form.to ?? ""}
                    onChange={(event) => updateForm("to", event.target.value)}
                    required
                  />
                </label>
              ) : (
                <div className="hidden lg:block" />
              )}

              <label className="space-y-2 text-sm font-medium">
                Vendedor (opcional)
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={form.sellerId ?? ""}
                  onChange={(event) =>
                    updateForm("sellerId", event.target.value || undefined)
                  }
                  disabled={isLoadingSellers}
                >
                  <option value="">
                    {isLoadingSellers
                      ? "Cargando vendedores..."
                      : "Todos los vendedores"}
                  </option>
                  {sellerUsers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.firstName} {seller.lastName} ({seller.email})
                    </option>
                  ))}
                </select>
                {sellersError && (
                  <span className="text-xs font-normal text-red-600">
                    {sellersError}
                  </span>
                )}
              </label>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Consultando..." : "Consultar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCustomRange((current) => !current);
                    setForm((current) => ({
                      ...current,
                      from: undefined,
                      to: undefined,
                    }));
                  }}
                >
                  {customRange ? "Usar fecha" : "Usar rango"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

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
                <ReportCard title="Pedidos" report={ordersReport} />
                <ReportCard title="Ventas pagadas" report={salesReport} />
              </div>
            </section>

            <section aria-labelledby="orders-list-title" className="space-y-3">
              <div>
                <h2 id="orders-list-title" className="text-lg font-semibold">
                  Listado de pedidos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pedidos que coinciden con los filtros aplicados.
                </p>
              </div>
              <Card>
                <CardContent className="p-0 sm:p-2">
                  <ListStateMessage
                    isLoading={ordersListLoading}
                    error={ordersListError}
                    isEmpty={!ordersList?.data.length}
                  />
                  {ordersList?.data.length ? (
                    <>
                      <ReportDetailsTable
                        kind="orders"
                        details={ordersList.data}
                      />
                      <PaginationControls
                        currentPage={ordersList.pagination.page}
                        totalPages={ordersList.pagination.totalPages}
                        itemsPerPage={ordersList.pagination.limit}
                        totalItems={ordersList.pagination.total}
                        onPageChange={(page) => void loadOrdersList(page)}
                        onItemsPerPageChange={() => undefined}
                        pageSizeOptions={[10]}
                      />
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </section>

            <section aria-labelledby="sales-list-title" className="space-y-3">
              <div>
                <h2 id="sales-list-title" className="text-lg font-semibold">
                  Listado de ventas pagadas
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ventas pagadas que coinciden con los filtros aplicados.
                </p>
              </div>
              <Card>
                <CardContent className="p-0 sm:p-2">
                  <ListStateMessage
                    isLoading={salesListLoading}
                    error={salesListError}
                    isEmpty={!salesList?.data.length}
                  />
                  {salesList?.data.length ? (
                    <>
                      <ReportDetailsTable
                        kind="sales"
                        details={salesList.data}
                      />
                      <PaginationControls
                        currentPage={salesList.pagination.page}
                        totalPages={salesList.pagination.totalPages}
                        itemsPerPage={salesList.pagination.limit}
                        totalItems={salesList.pagination.total}
                        onPageChange={(page) => void loadSalesList(page)}
                        onItemsPerPageChange={() => undefined}
                        pageSizeOptions={[10]}
                      />
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
