import { useSearchParams } from "react-router-dom";
import { PolicyCard, policies } from "@/entities/policy";
import { Pagination } from "@/shared/ui/pagination";

const PAGE_SIZE = 9;

export const PolicyPage = () => {
  const [searchParams] = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(policies.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = policies.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          월별활동보고
        </h1>
      </header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((policy) => (
          <li key={policy.id}>
            <PolicyCard policy={policy} />
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        getPageHref={(p) => `?page=${p}`}
        className="mt-2"
      />
    </div>
  );
};
