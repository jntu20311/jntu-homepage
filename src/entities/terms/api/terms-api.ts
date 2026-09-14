import { supabase } from "@/shared/api/supabase";
import type { Terms, TermsSlug } from "../model/types";

interface TermsRow {
  id: number;
  slug: TermsSlug;
  title: string;
  content: string | null;
  effective_date: string | null;
}

const mapTerms = (r: TermsRow): Terms => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  content: r.content ?? "",
  effectiveDate: r.effective_date,
});

/** 약관/개인정보 버전 목록 (적용날짜 내림차순) */
export const fetchTermsVersions = async (
  slug: TermsSlug,
): Promise<Terms[]> => {
  const { data, error } = await supabase
    .from("terms")
    .select("id, slug, title, content, effective_date")
    .eq("slug", slug)
    .order("effective_date", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapTerms(r as unknown as TermsRow));
};
