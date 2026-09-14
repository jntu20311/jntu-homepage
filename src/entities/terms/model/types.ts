export type TermsSlug = "terms" | "privacy";

export interface Terms {
  id: number;
  slug: TermsSlug;
  title: string;
  content: string;
  /** 적용(시행)날짜 (ISO date, 없을 수 있음) */
  effectiveDate: string | null;
}
