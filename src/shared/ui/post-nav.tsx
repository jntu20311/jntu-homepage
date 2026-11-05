import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, ListIcon } from "lucide-react";
import type { AdjacentPosts } from "@/shared/api/board";

interface PostNavProps {
  adjacent?: AdjacentPosts;
  listRoute: string;
  /** 글 id 로 상세 경로를 만든다 */
  detailRoute: (id: string) => string;
}

const linkClass =
  "inline-flex items-center gap-1 text-sm font-medium text-primary rounded-md hover:bg-gray-50 px-2 py-1";
const disabledClass =
  "inline-flex items-center gap-1 text-sm font-medium text-muted-foreground/50";

/** 상세 화면 하단 이전글 / 목록 / 다음글 */
export const PostNav = ({ adjacent, listRoute, detailRoute }: PostNavProps) => {
  const prev = adjacent?.prev;
  const next = adjacent?.next;
  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-center justify-between">
        {prev ? (
          <Link
            to={detailRoute(prev.id)}
            title={prev.title}
            className={linkClass}
          >
            <ChevronLeftIcon className="size-4" />
            이전글
          </Link>
        ) : (
          <span className={disabledClass}>
            <ChevronLeftIcon className="size-4" />
            이전글
          </span>
        )}

        <Link to={listRoute} className={linkClass}>
          <ListIcon className="size-4" />
          목록으로
        </Link>

        {next ? (
          <Link
            to={detailRoute(next.id)}
            title={next.title}
            className={linkClass}
          >
            다음글
            <ChevronRightIcon className="size-4" />
          </Link>
        ) : (
          <span className={disabledClass}>
            다음글
            <ChevronRightIcon className="size-4" />
          </span>
        )}
      </div>
    </div>
  );
};
