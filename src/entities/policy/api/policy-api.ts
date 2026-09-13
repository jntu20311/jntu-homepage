import { fetchBoardPage, fetchBoardOne } from "@/shared/api/board";
import type { Policy } from "../model/types";

const TABLE = "policy";

export const fetchPolicies = (
  page: number,
  pageSize: number,
): Promise<{ items: Policy[]; total: number }> =>
  fetchBoardPage(TABLE, page, pageSize) as Promise<{
    items: Policy[];
    total: number;
  }>;

export const fetchPolicy = (id: string): Promise<Policy | null> =>
  fetchBoardOne(TABLE, id) as Promise<Policy | null>;
