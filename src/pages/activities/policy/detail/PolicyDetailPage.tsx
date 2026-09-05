import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Eye } from "lucide-react";
import { findPolicy } from "@/entities/policy";
import { routes } from "@/shared/configs/routes";
import { formatDate, formatNumber } from "@/shared/lib/format";

export const PolicyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const policy = id ? findPolicy(id) : undefined;

  if (!policy) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">존재하지 않는 게시물입니다.</p>
        <Link
          to={routes.ACTIVITIES_POLICY}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <header className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {policy.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>작성자 {policy.author}</span>
          <time dateTime={policy.createdAt}>{formatDate(policy.createdAt)}</time>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-4" />
            {formatNumber(policy.views)}
          </span>
        </div>
      </header>

      <img
        src={policy.image}
        alt={policy.title}
        className="w-full rounded-xl border border-border bg-muted object-cover"
      />

      <div className="text-base leading-relaxed whitespace-pre-line text-foreground">
        {policy.content}
      </div>

      <div className="border-t border-border pt-5">
        <Link
          to={routes.ACTIVITIES_POLICY}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          목록으로
        </Link>
      </div>
    </article>
  );
};
