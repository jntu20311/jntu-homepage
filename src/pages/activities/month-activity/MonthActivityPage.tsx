import { useSearchParams } from "react-router-dom";
import { PolicyCard, usePolicies } from "@/entities/month-activity";
import { Pagination } from "@/shared/ui/pagination";

const PAGE_SIZE = 4;

export const MonthActivityPage = () => {
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data, isLoading: loading } = usePolicies(page, PAGE_SIZE);

  const items = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          월별활동보고
        </h1>
      </header>

      {loading ? (
        <p className="text-muted-foreground">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">등록된 게시물이 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((policy) => (
            <li key={policy.id}>
              <PolicyCard policy={policy} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        getPageHref={(p) => `?page=${p}`}
        className="mt-2"
      />
    </div>
  );
};
