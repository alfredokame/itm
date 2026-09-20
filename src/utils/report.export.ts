import type * as XLSX from "xlsx";
import type {
  ReportFilters,
  ReportOrderDetail,
  ReportResponse,
  ReportSaleDetail,
} from "@/types/report.types";
import {
  formatReportDateTime,
  formatReportPeriod,
  getReportCustomerName,
  getReportStatusLabel,
  REPORT_PERIOD_LABELS,
} from "@/utils/report.utils";

interface ReportExportData {
  orders: ReportOrderDetail[];
  sales: ReportSaleDetail[];
}

const EMPTY_VALUE = "—";

const setColumnWidths = (sheet: XLSX.WorkSheet, widths: number[]) => {
  sheet["!cols"] = widths.map((wch) => ({ wch }));
};

const buildFilters = (
  filters: ReportFilters,
  sellerName: string | undefined,
) => [
  ["Filtro", "Valor"],
  ["Agrupar por", REPORT_PERIOD_LABELS[filters.period]],
  ["Fecha", filters.date || EMPTY_VALUE],
  ["Desde", filters.from ? formatReportDateTime(filters.from) : EMPTY_VALUE],
  ["Hasta", filters.to ? formatReportDateTime(filters.to) : EMPTY_VALUE],
  ["Vendedor", sellerName || (filters.sellerId ? filters.sellerId : "Todos")],
];

const buildSummaryRows = <TDetail>(
  title: string,
  report: ReportResponse<TDetail> | null,
) => {
  if (!report) {
    return [[title], ["Sin datos"]];
  }

  return [
    [title],
    ["Período", "Registros", "Monto total"],
    ...report.data.map((row) => [
      formatReportPeriod(row.periodStart, report.period),
      row.count,
      row.totalAmount,
    ]),
    ["Total", report.totals.count, report.totals.totalAmount],
  ];
};

const buildOrderRows = (orders: ReportOrderDetail[]) =>
  orders.map((order) => [
    order.id,
    order.createdAt ? formatReportDateTime(order.createdAt) : EMPTY_VALUE,
    getReportCustomerName(order),
    order.user?.email || EMPTY_VALUE,
    getReportStatusLabel(order.status),
    order.deliveryMethod === "delivery" ? "Domicilio" : "Recogida",
    order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0,
    Number(order.totalPrice) || 0,
  ]);

const buildSaleRows = (sales: ReportSaleDetail[]) =>
  sales.map((sale) => [
    sale.id,
    sale.orderReference || sale.orderId || EMPTY_VALUE,
    sale.paidAt || sale.createdAt
      ? formatReportDateTime(sale.paidAt ?? sale.createdAt)
      : EMPTY_VALUE,
    getReportCustomerName(sale, true),
    sale.customerEmail || sale.user?.email || EMPTY_VALUE,
    getReportStatusLabel(sale.status),
    sale.reference || sale.transactionId || EMPTY_VALUE,
    sale.currency || EMPTY_VALUE,
    Number(sale.amount) || 0,
  ]);

export const exportReportsToExcel = async (
  filters: ReportFilters,
  ordersReport: ReportResponse<ReportOrderDetail> | null,
  salesReport: ReportResponse<ReportSaleDetail> | null,
  data: ReportExportData,
  sellerName?: string,
) => {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  const generatedAt = new Date().toISOString();
  const summaryRows = [
    ["Reporte de pedidos y ventas pagadas"],
    ["Generado el", formatReportDateTime(generatedAt)],
    [],
    ["Filtros aplicados"],
    ...buildFilters(filters, sellerName),
    [],
    ...buildSummaryRows("Resumen de pedidos", ordersReport),
    [],
    ...buildSummaryRows("Resumen de ventas pagadas", salesReport),
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  setColumnWidths(summarySheet, [28, 24, 18]);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Reporte");

  const ordersSheet = XLSX.utils.aoa_to_sheet([
    [
      "Pedido",
      "Fecha",
      "Cliente",
      "Correo",
      "Estado",
      "Entrega",
      "Productos",
      "Total",
    ],
    ...buildOrderRows(data.orders),
  ]);
  setColumnWidths(ordersSheet, [18, 22, 28, 32, 18, 16, 14, 16]);
  XLSX.utils.book_append_sheet(workbook, ordersSheet, "Pedidos");

  const salesSheet = XLSX.utils.aoa_to_sheet([
    [
      "Venta",
      "Pedido",
      "Fecha de pago",
      "Cliente",
      "Correo",
      "Estado",
      "Referencia",
      "Moneda",
      "Monto",
    ],
    ...buildSaleRows(data.sales),
  ]);
  setColumnWidths(salesSheet, [18, 18, 22, 28, 32, 18, 24, 12, 16]);
  XLSX.utils.book_append_sheet(workbook, salesSheet, "Ventas pagadas");

  const timestamp = generatedAt.replace(/[-:]/g, "").replace(/\..+/, "");
  XLSX.writeFile(workbook, `reporte-${timestamp}.xlsx`);

  return {
    orders: data.orders.length,
    sales: data.sales.length,
    generatedAt,
    message: `Se exportaron ${data.orders.length} pedidos y ${data.sales.length} ventas pagadas.`,
  };
};
