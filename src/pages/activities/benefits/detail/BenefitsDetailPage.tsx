import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Eye } from "lucide-react";
import { findBenefit } from "@/entities/benefit";
import { routes } from "@/shared/configs/routes";
import { formatDate, formatNumber } from "@/shared/lib/format";

export const BenefitsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const benefit = id ? findBenefit(id) : undefined;

  if (!benefit) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">존재하지 않는 게시물입니다.</p>
        <Link
          to={routes.ACTIVITIES_BENEFITS}
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
          {benefit.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>작성자 {benefit.author}</span>
          <time dateTime={benefit.createdAt}>
            {formatDate(benefit.createdAt)}
          </time>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-4" />
            {formatNumber(benefit.views)}
          </span>
        </div>
      </header>

      <img
        src={benefit.image}
        alt={benefit.title}
        className="w-full rounded-xl border border-border bg-muted object-cover"
      />

      <div className="text-base leading-relaxed whitespace-pre-line text-foreground">
        {benefit.content}
      </div>

      <div className="border-t border-border pt-5">
        <Link
          to={routes.ACTIVITIES_BENEFITS}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          목록으로
        </Link>
      </div>
    </article>
  );
};
