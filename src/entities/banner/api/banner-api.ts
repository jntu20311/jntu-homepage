import { supabase } from "@/shared/api/supabase";
import type { Banner } from "../model/types";

interface BannerRow {
  id: number;
  image_url: string;
  alt: string | null;
  link: string | null;
  external: boolean;
}

/** 홈 배너 슬라이드 (노출 ON, sort_order 오름차순) */
export const fetchBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase
    .from("banners")
    .select("id, image_url, alt, link, external")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((b) => {
    const row = b as unknown as BannerRow;
    return {
      id: row.id,
      imageUrl: row.image_url,
      alt: row.alt ?? "",
      link: row.link,
      external: Boolean(row.external),
    };
  });
};
