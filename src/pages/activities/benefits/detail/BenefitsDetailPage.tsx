import { fetchBenefit } from "@/entities/benefit";
import { routes } from "@/shared/configs/routes";
import { BoardDetail } from "@/pages/activities/BoardDetail";

export const BenefitsDetailPage = () => (
  <BoardDetail fetcher={fetchBenefit} backRoute={routes.ACTIVITIES_BENEFITS} />
);
