import {
  fetchBoardPage,
  fetchBoardOne,
  mapBoardRow,
  type BoardRow,
} from "@/shared/lib/board";
import type { Benefit } from "../model/types";

const TABLE = "benefits";

export const fetchBenefits = async (
  page: number,
  pageSize: number,
): Promise<{ items: Benefit[]; total: number }> => {
  const { rows, total } = await fetchBoardPage(TABLE, page, pageSize);
  return { items: rows.map((r) => mapBoardRow(r as unknown as BoardRow)), total };
};

export const fetchBenefit = async (id: string): Promise<Benefit | null> => {
  const row = await fetchBoardOne(TABLE, id);
  return row ? mapBoardRow(row as unknown as BoardRow) : null;
};
