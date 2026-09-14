import { supabase } from "@/shared/api/supabase";
import type { Press, PressType } from "../model/types";

const TABLE = "press";

interface PressRow {
  id: number;
  type: PressType;
  title: string;
  press_date: string;
  attachment_name: string | null;
  attachment_url: string | null;
  content: string;
}

const mapPress = (r: PressRow): Press => ({
  id: String(r.id),
  type: r.type,
  title: r.title,
  pressDate: r.press_date,
  content: r.content ?? "",
  attachment: r.attachment_url
    ? { name: r.attachment_name ?? "첨부파일", url: r.attachment_url }
    : undefined,
});

export const fetchPressList = async (
  page: number,
  pageSize: number,
): Promise<{ items: Press[]; total: number }> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await supabase
    .from(TABLE)
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("press_date", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return {
    items: (data ?? []).map((r) => mapPress(r as unknown as PressRow)),
    total: count ?? 0,
  };
};

export const fetchPress = async (id: string): Promise<Press | null> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPress(data as unknown as PressRow) : null;
};
