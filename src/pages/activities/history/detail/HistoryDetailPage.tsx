import { useActivity } from "@/entities/activity";
import { routes } from "@/shared/configs/routes";
import { BoardDetail } from "@/pages/activities/BoardDetail";

export const HistoryDetailPage = () => (
  <BoardDetail useItem={useActivity} backRoute={routes.ACTIVITIES_HISTORY} />
);
