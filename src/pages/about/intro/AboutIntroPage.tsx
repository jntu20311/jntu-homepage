import { PageHeader } from "@/shared/ui/page-header";

export const AboutIntroPage = () => {
  return (
    <section>
      <PageHeader title="소개" description="전남광주교사노조를 소개합니다." />

      <div className="flex w-full items-center justify-center text-white text-3xl font-bold bg-blue-600 h-200 ">
        {"카드뉴스 이미지"}
      </div>
    </section>
  );
};
