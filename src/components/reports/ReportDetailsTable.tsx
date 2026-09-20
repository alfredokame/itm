import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReportOrderDetail, ReportSaleDetail } from "@/types/report.types";
import {
  formatReportAmount,
  formatReportDateTime,
  getReportCustomerName,
  getReportStatusLabel,
} from "@/utils/report.utils";

type ReportDetailsTableProps =
  | { kind: "orders"; details: ReportOrderDetail[] }
  | { kind: "sales"; details: ReportSaleDetail[] };

export const ReportDetailsTable = ({
  kind,
  details,
}: ReportDetailsTableProps) => {
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
              <TableCell>{formatReportDateTime(order.createdAt)}</TableCell>
              <TableCell>
                <div>{getReportCustomerName(order)}</div>
                {order.user?.email && (
                  <div className="text-xs text-muted-foreground">{order.user.email}</div>
                )}
              </TableCell>
              <TableCell>{getReportStatusLabel(order.status)}</TableCell>
              <TableCell>
                {order.deliveryMethod === "delivery" ? "Domicilio" : "Recogida"}
              </TableCell>
              <TableCell className="text-right">
                {order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0}
              </TableCell>
              <TableCell className="text-right">
                {formatReportAmount(Number(order.totalPrice) || 0)}
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
            <TableCell>{formatReportDateTime(sale.paidAt ?? sale.createdAt)}</TableCell>
            <TableCell>
              <div>{getReportCustomerName(sale, true)}</div>
              {(sale.customerEmail || sale.user?.email) && (
                <div className="text-xs text-muted-foreground">
                  {sale.customerEmail || sale.user?.email}
                </div>
              )}
            </TableCell>
            <TableCell>{getReportStatusLabel(sale.status)}</TableCell>
            <TableCell>{sale.reference || sale.transactionId || "—"}</TableCell>
            <TableCell>{sale.currency || "—"}</TableCell>
            <TableCell className="text-right">
              {formatReportAmount(Number(sale.amount) || 0)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
