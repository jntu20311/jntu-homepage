import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Download } from "lucide-react";
import { PressTypeBadge, findPress } from "@/entities/press";
import { routes } from "@/shared/configs/routes";
import { formatDate } from "@/shared/lib/format";

export const PressDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const press = id ? findPress(id) : undefined;

  if (!press) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">존재하지 않는 게시물입니다.</p>
        <Link
          to={routes.ACTIVITIES_PRESS}
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
        <div className="flex items-center gap-2">
          <PressTypeBadge type={press.type} />
          <time
            dateTime={press.pressDate}
            className="text-sm text-muted-foreground"
          >
            {formatDate(press.pressDate)}
          </time>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {press.title}
        </h1>

        {press.attachment ? (
          <a
            href={press.attachment.url}
            download={press.attachment.name}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Download className="size-4" />
            {press.attachment.name}
          </a>
        ) : null}
      </header>

      {/* HTML 에디터 내용 렌더링 */}
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: press.content }}
      />

      <div className="border-t border-border pt-5">
        <Link
          to={routes.ACTIVITIES_PRESS}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="size-4" />
          목록으로
        </Link>
      </div>
    </article>
  );
};
