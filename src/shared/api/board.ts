import { supabase } from "./supabase";

/** 공개 게시판(주요활동/월별활동보고/조합원혜택) 공통 전송 헬퍼 */

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
  orderColumn = "published_at",
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

export interface AdjacentItem {
  id: string;
  title: string;
}

export interface AdjacentPosts {
  /** 이전글 (목록 정렬 기준으로 더 오래된 글) */
  prev: AdjacentItem | null;
  /** 다음글 (목록 정렬 기준으로 더 최신 글) */
  next: AdjacentItem | null;
}

/** 현재 글 기준 이전글/다음글 조회 (공개된 글만, orderColumn 기준) */
export const fetchAdjacentPosts = async (
  table: string,
  id: string,
  orderColumn = "published_at",
  mode: PublishMode = "schedule",
): Promise<AdjacentPosts> => {
  const published = <T extends { lte: Function; eq: Function }>(q: T) =>
    mode === "schedule"
      ? q.lte("published_at", new Date().toISOString())
      : q.eq("published", true);

  const { data: cur, error: curError } = await supabase
    .from(table)
    .select(orderColumn)
    .eq("id", id)
    .maybeSingle();
  if (curError) throw curError;
  const value = (cur as unknown as Record<string, string> | null)?.[
    orderColumn
  ];
  if (!value) return { prev: null, next: null };

  const [prevRes, nextRes] = await Promise.all([
    published(supabase.from(table).select("id, title"))
      .lt(orderColumn, value)
      .order(orderColumn, { ascending: false })
      .limit(1),
    published(supabase.from(table).select("id, title"))
      .gt(orderColumn, value)
      .order(orderColumn, { ascending: true })
      .limit(1),
  ]);
  if (prevRes.error) throw prevRes.error;
  if (nextRes.error) throw nextRes.error;

  const toItem = (rows: unknown): AdjacentItem | null => {
    const r = (rows as { id: number; title: string }[] | null)?.[0];
    return r ? { id: String(r.id), title: r.title } : null;
  };
  return { prev: toItem(prevRes.data), next: toItem(nextRes.data) };
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

const VIEW_TTL_MS = 24 * 60 * 60 * 1000;

const viewedKey = (table: string, id: string) => `viewed:${table}:${id}`;

/** 최근 24시간 내 이미 집계한 글인지 (localStorage 접근 실패 시 false) */
const hasRecentlyViewed = (table: string, id: string): boolean => {
  try {
    const at = Number(localStorage.getItem(viewedKey(table, id)));
    return at > 0 && Date.now() - at < VIEW_TTL_MS;
  } catch {
    return false;
  }
};

/**
 * 조회수 +1 (브라우저당 글별 24시간 1회).
 * 증가했으면 true. 실패해도 화면에는 영향을 주지 않는다.
 */
export const incrementViews = async (
  table: string,
  id: string,
): Promise<boolean> => {
  if (hasRecentlyViewed(table, id)) return false;
  // StrictMode 중복 실행 방지: 호출 전에 먼저 기록
  try {
    localStorage.setItem(viewedKey(table, id), String(Date.now()));
  } catch {
    // 저장 불가 환경 — 그냥 집계
  }
  const { error } = await supabase.rpc("increment_views", {
    table_name: table,
    row_id: Number(id),
  });
  if (error) {
    try {
      localStorage.removeItem(viewedKey(table, id));
    } catch {
      // ignore
    }
    return false;
  }
  return true;
};
