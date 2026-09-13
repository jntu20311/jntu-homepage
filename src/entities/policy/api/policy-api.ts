import {
  fetchBoardPage,
  fetchBoardOne,
  mapBoardRow,
  type BoardRow,
} from "@/shared/lib/board";
import type { Policy } from "../model/types";

const TABLE = "policy";

export const fetchPolicies = async (
  page: number,
  pageSize: number,
): Promise<{ items: Policy[]; total: number }> => {
  const { rows, total } = await fetchBoardPage(TABLE, page, pageSize);
  return { items: rows.map((r) => mapBoardRow(r as unknown as BoardRow)), total };
};

export const fetchPolicy = async (id: string): Promise<Policy | null> => {
  const row = await fetchBoardOne(TABLE, id);
  return row ? mapBoardRow(row as unknown as BoardRow) : null;
};
