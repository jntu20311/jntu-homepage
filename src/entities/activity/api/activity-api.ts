import {
  fetchBoardPage,
  fetchBoardOne,
  mapBoardRow,
  type BoardRow,
} from "@/shared/lib/board";
import type { Activity } from "../model/types";

const TABLE = "activities";

export const fetchActivities = async (
  page: number,
  pageSize: number,
): Promise<{ items: Activity[]; total: number }> => {
  const { rows, total } = await fetchBoardPage(TABLE, page, pageSize);
  return { items: rows.map((r) => mapBoardRow(r as unknown as BoardRow)), total };
};

export const fetchActivity = async (id: string): Promise<Activity | null> => {
  const row = await fetchBoardOne(TABLE, id);
  return row ? mapBoardRow(row as unknown as BoardRow) : null;
};
