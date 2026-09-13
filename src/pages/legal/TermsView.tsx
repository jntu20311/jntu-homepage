import { useState } from "react";
import { Markdown } from "@/shared/ui/markdown";
import { formatDate } from "@/shared/lib/format";
import { useTermsVersions, type TermsSlug } from "@/entities/terms";

interface TermsViewProps {
  slug: TermsSlug;
  emptyMessage: string;
}

/** 약관/개인정보 공통 화면 — 적용날짜별 버전을 선택해 열람 */
export const TermsView = ({ slug, emptyMessage }: TermsViewProps) => {
  const { data: versions, isLoading } = useTermsVersions(slug);

  // 선택 안 하면 최신(첫) 버전을 기본 표시
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const current =
    versions?.find((v) => v.id === selectedId) ?? versions?.[0] ?? null;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {isLoading ? (
        <p className="text-muted-foreground">불러오는 중...</p>
      ) : !current ? (
        <p className="text-muted-foreground">{emptyMessage}</p>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-border pb-4">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">적용날짜</span>
              <select
                className="rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                value={current.id}
                onChange={(e) => setSelectedId(Number(e.target.value))}
              >
                {versions?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.effectiveDate ? formatDate(v.effectiveDate) : "(미지정)"}
                    {" 시행"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Markdown>{current.content || emptyMessage}</Markdown>
        </>
      )}
    </section>
  );
};
