import type {
  ReportFilters,
  ReportPeriod,
} from "@/types/report.types";

export const REPORT_PERIOD_LABELS: Record<ReportPeriod, string> = {
  day: "Día",
  month: "Mes",
  year: "Año",
};

export const formatReportAmount = (amount: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export const formatReportPeriod = (value: string, period: ReportPeriod) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: period === "day" ? "medium" : "long",
  }).format(new Date(value));

export const formatReportDateTime = (value: string) =>
  new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const toUtcIso = (value: string) =>
  new Date(`${value}T00:00:00.000Z`).toISOString();

export const getListDateFilters = (filters: ReportFilters) => {
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

export const getUserDisplayName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`.trim();
