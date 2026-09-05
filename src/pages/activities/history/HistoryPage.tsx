import { useSearchParams } from "react-router-dom";
import { ActivityCard, activities } from "@/entities/activity";
import { Pagination } from "@/shared/ui/pagination";

const PAGE_SIZE = 9;

export const HistoryPage = () => {
  const [searchParams] = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = activities.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          활동내역
        </h1>
        {/* <p className="mt-2 text-lg text-muted-foreground">
          {`(총 ${activities.length}건)`}
        </p> */}
      </header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((activity) => (
          <li key={activity.id}>
            <ActivityCard activity={activity} />
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
