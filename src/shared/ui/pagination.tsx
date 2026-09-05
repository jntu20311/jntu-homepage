import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** 각 페이지로 이동할 링크(to)를 생성합니다. */
  getPageHref: (page: number) => string;
  className?: string;
}

type PageItem = number | "ellipsis";

const buildPageItems = (page: number, total: number): PageItem[] => {
  const pages = new Set<number>([1, total]);
  for (let p = page - 1; p <= page + 1; p += 1) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
};

const baseCell =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium";

export const Pagination = ({
  page,
  totalPages,
  getPageHref,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const items = buildPageItems(page, totalPages);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      role="navigation"
      aria-label="페이지네이션"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {isFirst ? (
        <span
          aria-disabled="true"
          className={cn(baseCell, "text-muted-foreground/50")}
        >
          <ChevronLeft className="size-4" />
        </span>
      ) : (
        <Link
          to={getPageHref(page - 1)}
          aria-label="이전 페이지"
          className={cn(baseCell, "hover:bg-accent hover:text-accent-foreground")}
        >
          <ChevronLeft className="size-4" />
        </Link>
      )}

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className={cn(baseCell, "text-muted-foreground")}
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            to={getPageHref(item)}
            aria-label={`${item} 페이지`}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              baseCell,
              item === page
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {isLast ? (
        <span
          aria-disabled="true"
          className={cn(baseCell, "text-muted-foreground/50")}
        >
          <ChevronRight className="size-4" />
        </span>
      ) : (
        <Link
          to={getPageHref(page + 1)}
          aria-label="다음 페이지"
          className={cn(baseCell, "hover:bg-accent hover:text-accent-foreground")}
        >
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
};
