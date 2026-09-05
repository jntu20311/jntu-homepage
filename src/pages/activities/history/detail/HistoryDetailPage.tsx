import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Eye } from "lucide-react";
import { findActivity } from "@/entities/activity";
import { routes } from "@/shared/configs/routes";
import { formatDate, formatNumber } from "@/shared/lib/format";

export const HistoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const activity = id ? findActivity(id) : undefined;

  if (!activity) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">존재하지 않는 게시물입니다.</p>
        <Link
          to={routes.ACTIVITIES_HISTORY}
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
          {activity.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>작성자 {activity.author}</span>
          <time dateTime={activity.createdAt}>
            {formatDate(activity.createdAt)}
          </time>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-4" />
            {formatNumber(activity.views)}
          </span>
        </div>
      </header>

      <img
        src={activity.image}
        alt={activity.title}
        className="w-full rounded-xl border border-border bg-muted object-cover"
      />

      <div className="text-base leading-relaxed whitespace-pre-line text-foreground">
        {activity.content}
      </div>

      <div className="border-t border-border pt-5">
        <Link
          to={routes.ACTIVITIES_HISTORY}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          목록으로
        </Link>
      </div>
    </article>
  );
};
