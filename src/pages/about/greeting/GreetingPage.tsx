import { PageHeader } from "@/shared/ui/page-header";

export const GreetingPage = () => {
  return (
    <div>
      <PageHeader title="인사말" description="인사말입니다." />
      <div className="flex w-full items-center justify-center text-white text-3xl font-bold bg-green-600 h-200">
        {"카드뉴스 이미지"}
      </div>
    </div>
  );
};
