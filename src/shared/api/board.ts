import { supabase } from "./supabase";

/** 공개 게시판(활동내역/월별활동보고/조합원혜택) 공통 전송 헬퍼 */

/**
 * 공개 노출 기준.
 * - "schedule": published_at(예약 datetime)이 현재 시각을 지난 글만 공개 (null=비공개)
 * - "boolean":  published=true 인 글만 공개 (press 전용, 레거시)
 */
export type PublishMode = "schedule" | "boolean";

export interface BoardRow {
  id: number;
  title: string;
  content: string;
  author: string | null;
  views: number;
  image_url: string | null;
  published_at: string;
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
  createdAt: row.published_at,
});

/** 공개된 게시글 페이지 조회 (내림차순) */
export const fetchBoardPage = async (
  table: string,
  page: number,
  pageSize: number,
  orderColumn = "created_at",
  mode: PublishMode = "schedule",
): Promise<{ items: BoardItem[]; total: number }> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const base = supabase.from(table).select("*", { count: "exact" });
  const filtered =
    mode === "schedule"
      ? base.lte("published_at", new Date().toISOString())
      : base.eq("published", true);
  const { data, count, error } = await filtered
    .order(orderColumn, { ascending: false })
    .range(from, to);
  if (error) throw error;
  const rows = (data ?? []) as unknown as BoardRow[];
  return { items: rows.map(mapBoardRow), total: count ?? 0 };
};

/** 공개된 게시글 단건 조회 */
export const fetchBoardOne = async (
  table: string,
  id: string,
  mode: PublishMode = "schedule",
): Promise<BoardItem | null> => {
  const base = supabase.from(table).select("*").eq("id", id);
  const filtered =
    mode === "schedule"
      ? base.lte("published_at", new Date().toISOString())
      : base.eq("published", true);
  const { data, error } = await filtered.maybeSingle();
  if (error) throw error;
  return data ? mapBoardRow(data as unknown as BoardRow) : null;
};

export interface PreviewItem {
  id: string;
  title: string;
  date: string;
}

/** 홈 화면 게시판 미리보기 (최신 N건) */
export const fetchBoardPreview = async (
  table: string,
  dateColumn = "created_at",
  limit = 5,
  mode: PublishMode = "schedule",
): Promise<PreviewItem[]> => {
  const base = supabase.from(table).select(`id, title, ${dateColumn}`);
  const filtered =
    mode === "schedule"
      ? base.lte("published_at", new Date().toISOString())
      : base.eq("published", true);
  const { data, error } = await filtered
    .order(dateColumn, { ascending: false })
    .limit(limit);
  if (error) throw error;
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    date: String(r[dateColumn]),
  }));
};
