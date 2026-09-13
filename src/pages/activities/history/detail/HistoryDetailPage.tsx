import { fetchActivity } from "@/entities/activity";
import { routes } from "@/shared/configs/routes";
import { BoardDetail } from "@/pages/activities/BoardDetail";

export const HistoryDetailPage = () => (
  <BoardDetail fetcher={fetchActivity} backRoute={routes.ACTIVITIES_HISTORY} />
);
