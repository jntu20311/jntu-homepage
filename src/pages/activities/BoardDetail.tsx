import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Eye } from "lucide-react";
import { formatDate, formatNumber } from "@/shared/lib/format";
import { useAsync } from "@/shared/lib/use-async";
import type { BoardItem } from "@/shared/lib/board";

interface BoardDetailProps {
  fetcher: (id: string) => Promise<BoardItem | null>;
  backRoute: string;
}

/** 활동내역/정책/조합원혜택 상세 공통 컴포넌트 */
export const BoardDetail = ({ fetcher, backRoute }: BoardDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: item, loading } = useAsync(
    () => (id ? fetcher(id) : Promise.resolve(null)),
    [id],
  );

  const backLink = (
    <Link
      to={backRoute}
      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
    >
      <ChevronLeft className="size-4" />
      목록으로
    </Link>
  );

  if (loading) {
    return <p className="text-muted-foreground">불러오는 중...</p>;
  }

  if (!item) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">존재하지 않는 게시물입니다.</p>
        {backLink}
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <header className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {item.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {item.author && <span>작성자 {item.author}</span>}
          <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-4" />
            {formatNumber(item.views)}
          </span>
        </div>
      </header>

      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-full rounded-xl border border-border bg-muted object-cover"
        />
      )}

      {/* CKEditor HTML 본문 */}
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />

      <div className="border-t border-border pt-5">{backLink}</div>
    </article>
  );
};
