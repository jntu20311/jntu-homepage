import { Link } from "react-router-dom";
import { activityHistoryDetailPath } from "@/shared/configs/routes";
import { formatDate } from "@/shared/lib/format";
import type { Activity } from "../model/types";

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <Link
      to={activityHistoryDetailPath(activity.id)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={activity.image}
          alt={activity.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-card-foreground">
          {activity.title}
        </h3>
        <time
          dateTime={activity.createdAt}
          className="mt-auto text-sm text-muted-foreground"
        >
          {formatDate(activity.createdAt)}
        </time>
      </div>
    </Link>
  );
};
