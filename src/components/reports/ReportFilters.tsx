import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ReportFilters as ReportFiltersType, ReportPeriod } from "@/types/report.types";
import type { User } from "@/types/user.types";
import { getUserDisplayName, REPORT_PERIOD_LABELS } from "@/utils/report.utils";

interface ReportFiltersProps {
  value: ReportFiltersType;
  users: User[];
  isLoadingUsers: boolean;
  usersError: string | null;
  isLoadingReports: boolean;
  customRange: boolean;
  onChange: <K extends keyof ReportFiltersType>(
    key: K,
    value: ReportFiltersType[K],
  ) => void;
  onPeriodChange: (period: ReportPeriod) => void;
  onCustomRangeChange: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const ReportFilters = ({
  value,
  users,
  isLoadingUsers,
  usersError,
  isLoadingReports,
  customRange,
  onChange,
  onPeriodChange,
  onCustomRangeChange,
  onSubmit,
}: ReportFiltersProps) => (
  <Card>
    <CardContent className="pt-6">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
      >
        <label className="space-y-2 text-sm font-medium">
          Agrupar por
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={value.period}
            onChange={(event) => onPeriodChange(event.target.value as ReportPeriod)}
          >
            {Object.entries(REPORT_PERIOD_LABELS).map(([period, label]) => (
              <option key={period} value={period}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium">
          {customRange ? "Desde" : "Fecha"}
          <Input
            type="date"
            value={customRange ? (value.from ?? "") : (value.date ?? "")}
            onChange={(event) =>
              onChange(customRange ? "from" : "date", event.target.value)
            }
            required
          />
        </label>

        {customRange ? (
          <label className="space-y-2 text-sm font-medium">
            Hasta
            <Input
              type="date"
              value={value.to ?? ""}
              onChange={(event) => onChange("to", event.target.value)}
              required
            />
          </label>
        ) : (
          <div className="hidden lg:block" />
        )}

        <label className="space-y-2 text-sm font-medium">
          Vendedor (seller/admin)
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={value.sellerId ?? ""}
            onChange={(event) => onChange("sellerId", event.target.value || undefined)}
            disabled={isLoadingUsers}
          >
            <option value="">
              {isLoadingUsers ? "Cargando usuarios..." : "Todos los vendedores"}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {getUserDisplayName(user.firstName, user.lastName)} ({user.email})
              </option>
            ))}
          </select>
          {usersError && (
            <span className="text-xs font-normal text-red-600">{usersError}</span>
          )}
        </label>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isLoadingReports}>
            {isLoadingReports ? "Consultando..." : "Consultar"}
          </Button>
          <Button type="button" variant="outline" onClick={onCustomRangeChange}>
            {customRange ? "Usar fecha" : "Usar rango"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);
