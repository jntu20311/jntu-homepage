import { Markdown } from "@/shared/ui/markdown";
import { fetchTerms } from "@/shared/lib/home-api";
import { useAsync } from "@/shared/lib/use-async";

export const PrivacyPage = () => {
  const { data, loading } = useAsync(() => fetchTerms("privacy"), []);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {loading ? (
        <p className="text-muted-foreground">불러오는 중...</p>
      ) : (
        <Markdown>{data?.content || "등록된 개인정보취급방침이 없습니다."}</Markdown>
      )}
    </section>
  );
};
