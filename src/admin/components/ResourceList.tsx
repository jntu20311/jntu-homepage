import { useTable, useDelete } from "@refinedev/core";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/lib/format";
import type { ColumnDef, ResourceDef } from "../config";

const renderCell = (col: ColumnDef, row: Record<string, unknown>) => {
  const value = row[col.name];
  if (col.type === "date" && value)
    return formatDate(String(value));
  if (col.type === "boolean")
    return value ? "✓" : "—";
  if (col.type === "image" && value)
    return (
      <img
        src={String(value)}
        alt=""
        className="h-10 w-16 rounded border object-contain"
      />
    );
  if (col.type === "badge" && value)
    return (
      <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">
        {String(value)}
      </span>
    );
  return value == null ? "—" : String(value);
};

export const ResourceList = ({ resource }: { resource: ResourceDef }) => {
  const {
    result: { data, total },
    currentPage,
    setCurrentPage,
    pageCount,
    tableQuery: { isLoading },
  } = useTable({
    resource: resource.name,
    dataProviderName: resource.dataProviderName,
    sorters: resource.sorter
      ? { initial: [resource.sorter] }
      : undefined,
    pagination: { pageSize: 20 },
    meta: resource.idColumnName
      ? { idColumnName: resource.idColumnName }
      : undefined,
  });

  const { mutate: remove } = useDelete();

  const canCreate = resource.canCreate !== false;
  const canEdit = resource.canEdit !== false;
  const canDelete = resource.canDelete !== false;

  const idFor = (row: Record<string, unknown>) =>
    String(row.id ?? row.slug ?? "");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {resource.label}
          {typeof total === "number" && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              총 {total}건
            </span>
          )}
        </h1>
        {canCreate && (
          <Button asChild size="sm">
            <Link to={`/admin/${resource.name}/create`}>등록</Link>
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              {resource.list.map((c) => (
                <th key={c.name} className="px-3 py-2 text-left font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={resource.list.length + 1} className="px-3 py-6 text-center text-muted-foreground">
                  불러오는 중...
                </td>
              </tr>
            )}
            {!isLoading &&
              (data ?? []).map((row) => {
                const id = idFor(row);
                const protectedRow = Boolean(row.is_protected);
                return (
                  <tr key={id} className="border-b last:border-0 hover:bg-muted/20">
                    {resource.list.map((c) => (
                      <td key={c.name} className="px-3 py-2 align-middle">
                        {renderCell(c, row)}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {canEdit && (
                        <Button asChild size="xs" variant="ghost">
                          <Link to={`/admin/${resource.name}/edit/${id}`}>수정</Link>
                        </Button>
                      )}
                      {canDelete && !protectedRow && (
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => {
                            if (!confirm("삭제하시겠습니까?")) return;
                            remove({
                              resource: resource.name,
                              id,
                              dataProviderName: resource.dataProviderName,
                            });
                          }}
                        >
                          삭제
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            {!isLoading && (data ?? []).length === 0 && (
              <tr>
                <td colSpan={resource.list.length + 1} className="px-3 py-6 text-center text-muted-foreground">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            이전
          </Button>
          <span className="text-sm">
            {currentPage} / {pageCount}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage >= pageCount}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
};
