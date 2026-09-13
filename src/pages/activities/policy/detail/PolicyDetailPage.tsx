import { fetchPolicy } from "@/entities/policy";
import { routes } from "@/shared/configs/routes";
import { BoardDetail } from "@/pages/activities/BoardDetail";

export const PolicyDetailPage = () => (
  <BoardDetail fetcher={fetchPolicy} backRoute={routes.ACTIVITIES_POLICY} />
);
