import { Link } from "react-router-dom";
import { monthActivityDetailPath } from "@/shared/configs/routes";
import { formatDate } from "@/shared/lib/format";
import type { MonthActivity } from "../model/types";

interface MonthActivityCardProps {
  policy: MonthActivity;
}

export const MonthActivityCard = ({ policy }: MonthActivityCardProps) => {
  return (
    <Link
      to={monthActivityDetailPath(policy.id)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="aspect-[1080/1350] w-full overflow-hidden bg-muted">
        <img
          src={policy.image}
          alt={policy.title}
          loading="lazy"
          className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-card-foreground">
          {policy.title}
        </h3>
        <time
          dateTime={policy.createdAt}
          className="mt-auto text-sm text-muted-foreground"
        >
          {formatDate(policy.createdAt)}
        </time>
      </div>
    </Link>
  );
};
