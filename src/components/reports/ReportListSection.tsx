import { Card, CardContent } from "@/components/ui/card";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";
import { PaginationControls } from "@/components/common/PaginationControls";
import type {
  ReportOrderDetail,
  ReportSaleDetail,
} from "@/types/report.types";
import { ReportDetailsTable } from "./ReportDetailsTable";

interface ReportPagination {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
}

interface ReportListSectionCommonProps {
  title: string;
  description: string;
  pagination: ReportPagination | null;
  isLoading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
}

type ReportListSectionProps = ReportListSectionCommonProps &
  (
    | {
      kind: "orders";
      data: ReportOrderDetail[];
    }
    | {
      kind: "sales";
      data: ReportSaleDetail[];
    }
  );

export const ReportListSection = ({
  title,
  description,
  kind,
  data,
  pagination,
  isLoading,
  error,
  onPageChange,
}: ReportListSectionProps) => (
  <section aria-labelledby={`${kind}-list-title`} className="space-y-3">
    <div>
      <h2 id={`${kind}-list-title`} className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Card>
      <CardContent className="p-0 sm:p-2">
        {isLoading ? (
          <DataStateSkeleton variant="table" count={4} />
        ) : error ? (
          <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : !data.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay registros para los filtros seleccionados.
          </p>
        ) : (
          <>
            {kind === "orders" ? (
              <ReportDetailsTable kind="orders" details={data} />
            ) : (
              <ReportDetailsTable kind="sales" details={data} />
            )}
            {pagination && (
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                itemsPerPage={pagination.limit}
                totalItems={pagination.total}
                onPageChange={onPageChange}
                onItemsPerPageChange={() => undefined}
                pageSizeOptions={[pagination.limit]}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  </section>
);
