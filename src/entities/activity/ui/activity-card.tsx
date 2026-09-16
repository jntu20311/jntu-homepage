import { Link } from "react-router-dom";
import { activityHistoryDetailPath } from "@/shared/configs/routes";
import { formatDate } from "@/shared/lib/format";
import type { Activity } from "../model/types";
import AutoColorContainer from "@/shared/ui/auto-color-container";

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <Link
      to={activityHistoryDetailPath(activity.id)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <AutoColorContainer src={activity.image} alt={activity.title} />
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
