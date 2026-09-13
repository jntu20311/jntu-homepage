import { usePolicy } from "@/entities/month-activity";
import { routes } from "@/shared/configs/routes";
import { BoardDetail } from "@/pages/activities/BoardDetail";

export const MonthActivityDetailPage = () => (
  <BoardDetail
    useItem={usePolicy}
    backRoute={routes.ACTIVITIES_MONTH_ACTIVITY}
  />
);
