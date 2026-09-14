import { fetchBoardPage, fetchBoardOne } from "@/shared/api/board";
import type { Benefit } from "../model/types";

const TABLE = "benefits";

export const fetchBenefits = (
  page: number,
  pageSize: number,
): Promise<{ items: Benefit[]; total: number }> =>
  fetchBoardPage(TABLE, page, pageSize) as Promise<{
    items: Benefit[];
    total: number;
  }>;

export const fetchBenefit = (id: string): Promise<Benefit | null> =>
  fetchBoardOne(TABLE, id) as Promise<Benefit | null>;
