import { supabase } from "./supabase";
import type { SlideImage } from "@/shared/ui/image-slider";

interface BannerRow {
  image_url: string;
  alt: string | null;
  link: string | null;
  external: boolean;
}

/** 홈 배너 슬라이드 (노출 ON, sort_order 오름차순) */
export const fetchBanners = async (): Promise<SlideImage[]> => {
  const { data, error } = await supabase
    .from("banners")
    .select("image_url, alt, link, external")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((b: BannerRow) => ({
    src: b.image_url,
    alt: b.alt ?? "",
    link: b.link ?? null,
    external: Boolean(b.external),
  }));
};

export interface HomeLinkItem {
  label: string;
  link: string;
  external: boolean;
}

/** 홈 바로가기 링크 */
export const fetchHomeLinks = async (): Promise<HomeLinkItem[]> => {
  const { data, error } = await supabase
    .from("home_links")
    .select("label, link, external")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HomeLinkItem[];
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
): Promise<PreviewItem[]> => {
  const { data, error } = await supabase
    .from(table)
    .select(`id, title, ${dateColumn}`)
    .eq("published", true)
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

/** 약관/개인정보 본문 (Markdown) */
export const fetchTerms = async (
  slug: "terms" | "privacy",
): Promise<{ title: string; content: string } | null> => {
  const { data, error } = await supabase
    .from("terms")
    .select("title, content")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as { title: string; content: string } | null;
};
