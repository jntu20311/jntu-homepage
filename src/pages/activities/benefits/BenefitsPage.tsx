import { useSearchParams } from "react-router-dom";
import { BenefitCard, benefits } from "@/entities/benefit";
import { Pagination } from "@/shared/ui/pagination";

const PAGE_SIZE = 4;

export const BenefitsPage = () => {
  const [searchParams] = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(benefits.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = benefits.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          조합원 혜택
        </h1>
      </header>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {pageItems.map((benefit) => (
          <li key={benefit.id}>
            <BenefitCard benefit={benefit} />
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
