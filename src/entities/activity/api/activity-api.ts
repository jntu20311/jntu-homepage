import { fetchBoardPage, fetchBoardOne } from "@/shared/api/board";
import type { Activity } from "../model/types";

const TABLE = "activities";

export const fetchActivities = (
  page: number,
  pageSize: number,
): Promise<{ items: Activity[]; total: number }> =>
  fetchBoardPage(TABLE, page, pageSize) as Promise<{
    items: Activity[];
    total: number;
  }>;

export const fetchActivity = (id: string): Promise<Activity | null> =>
  fetchBoardOne(TABLE, id) as Promise<Activity | null>;
