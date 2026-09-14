import { Link, useSearchParams } from "react-router-dom";
import { Paperclip } from "lucide-react";
import { PressTypeBadge, usePressList } from "@/entities/press";
import { pressDetailPath } from "@/shared/configs/routes";
import { formatDate } from "@/shared/lib/format";
import { Pagination } from "@/shared/ui/pagination";

const PAGE_SIZE = 10;

export const PressPage = () => {
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data, isLoading: loading } = usePressList(page, PAGE_SIZE);

  const items = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {`보도자료 및 성명서`}
        </h1>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-t-2 border-foreground text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="w-24 px-3 py-3 text-center font-medium">번호</th>
              <th className="w-24 px-3 py-3 text-center font-medium">유형</th>
              <th className="px-3 py-3 text-center font-medium">제목</th>
              <th className="w-32 px-3 py-3 text-center font-medium whitespace-nowrap">
                보도날짜
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-6 text-center text-muted-foreground"
                >
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-6 text-center text-muted-foreground"
                >
                  등록된 게시물이 없습니다.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((press) => (
                <tr
                  key={press.id}
                  className="border-b border-border transition-colors hover:bg-accent/50"
                >
                  <td className="px-3 py-3 text-center">{press.id}</td>
                  <td className="px-3 py-3 text-center">
                    <PressTypeBadge type={press.type} />
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to={pressDetailPath(press.id)}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                    >
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
