import { supabase } from "./supabase";

/** 공개 게시판(활동내역/정책/조합원혜택) 공통 조회 헬퍼 */

export interface BoardRow {
  id: number;
  title: string;
  content: string;
  author: string | null;
  views: number;
  image_url: string | null;
  created_at: string;
}

export interface BoardItem {
  id: string;
  title: string;
  content: string;
  author: string;
  views: number;
  image: string;
  createdAt: string;
}

export const mapBoardRow = (row: BoardRow): BoardItem => ({
  id: String(row.id),
  title: row.title,
  content: row.content ?? "",
  author: row.author ?? "",
  views: row.views ?? 0,
  image: row.image_url ?? "",
  createdAt: row.created_at,
});

/** 공개된 게시글 페이지 조회 (내림차순) */
export const fetchBoardPage = async (
  table: string,
  page: number,
  pageSize: number,
  orderColumn = "created_at",
): Promise<{ rows: Record<string, unknown>[]; total: number }> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await supabase
    .from(table)
    .select("*", { count: "exact" })
    .eq("published", true)
    .order(orderColumn, { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0 };
};

/** 공개된 게시글 단건 조회 */
export const fetchBoardOne = async (
  table: string,
  id: string,
): Promise<Record<string, unknown> | null> => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data;
};
