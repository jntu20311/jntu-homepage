import { fetchBoardPage, fetchBoardOne } from "@/shared/api/board";
import type { MonthActivity } from "../model/types";

const TABLE = "month_activities";

export const fetchMonthActivities = (
  page: number,
  pageSize: number,
): Promise<{ items: MonthActivity[]; total: number }> =>
  fetchBoardPage(TABLE, page, pageSize) as Promise<{
    items: MonthActivity[];
    total: number;
  }>;

export const fetchMonthActivity = (id: string): Promise<MonthActivity | null> =>
  fetchBoardOne(TABLE, id) as Promise<MonthActivity | null>;
