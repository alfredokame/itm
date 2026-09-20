import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReportResponse } from "@/types/report.types";
import {
  formatReportAmount,
  formatReportPeriod,
} from "@/utils/report.utils";

interface ReportSummaryCardProps<TDetail> {
  title: string;
  report: ReportResponse<TDetail> | null;
}

export const ReportSummaryCard = <TDetail,>({
  title,
  report,
}: ReportSummaryCardProps<TDetail>) => (
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
            {formatReportAmount(report?.totals.totalAmount ?? 0)}
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
                <TableCell>{formatReportPeriod(row.periodStart, report.period)}</TableCell>
                <TableCell className="text-right">{row.count}</TableCell>
                <TableCell className="text-right">
                  {formatReportAmount(row.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>
);
