import { Link, useSearchParams } from "react-router-dom";
import { Paperclip } from "lucide-react";
import { PressTypeBadge, pressReleases } from "@/entities/press";
import { pressDetailPath } from "@/shared/configs/routes";
import { formatDate } from "@/shared/lib/format";
import { Pagination } from "@/shared/ui/pagination";

const PAGE_SIZE = 10;

export const PressPage = () => {
  const [searchParams] = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(pressReleases.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = pressReleases.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          보도자료 및 성명서
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          전남광주교사노조의 보도자료와 성명서입니다. (총 {pressReleases.length}
          건)
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-t-2 border-foreground text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="w-24 px-3 py-3 text-center font-medium">번호</th>
              <th className="px-3 py-3 text-center font-medium">제목</th>
              <th className="w-32 px-3 py-3 text-center font-medium whitespace-nowrap">
                보도날짜
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((press) => (
              <tr
                key={press.id}
                className="border-b border-border transition-colors hover:bg-accent/50"
              >
                <td className="px-3 py-3 text-center">{press.id}</td>
                <td className="px-3 py-3">
                  <Link
                    to={pressDetailPath(press.id)}
                    className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                  >
                    <PressTypeBadge type={press.type} />
                    <span className="line-clamp-1">{press.title}</span>
                    {press.attachment ? (
                      <Paperclip
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-label="첨부파일 있음"
                      />
                    ) : null}
                  </Link>
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap text-muted-foreground">
                  {formatDate(press.pressDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        getPageHref={(p) => `?page=${p}`}
        className="mt-2"
      />
    </div>
  );
};
