import { usePolicy } from "@/entities/policy";
import { routes } from "@/shared/configs/routes";
import { BoardDetail } from "@/pages/activities/BoardDetail";

export const PolicyDetailPage = () => (
  <BoardDetail useItem={usePolicy} backRoute={routes.ACTIVITIES_POLICY} />
);
