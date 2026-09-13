import { supabase } from "@/shared/api/supabase";
import type { HomeLink } from "../model/types";

interface HomeLinkRow {
  label: string;
  link: string;
  external: boolean;
}

/** 홈 바로가기 링크 (노출 ON, sort_order 오름차순) */
export const fetchHomeLinks = async (): Promise<HomeLink[]> => {
  const { data, error } = await supabase
    .from("home_links")
    .select("label, link, external")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => {
    const row = r as unknown as HomeLinkRow;
    return { label: row.label, link: row.link, external: row.external };
  });
};
