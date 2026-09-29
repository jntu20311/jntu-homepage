import { PageHeader } from "@/shared/ui/page-header";
import GrettingImage from "@/shared/assets/images/img_greeting.png";

export const GreetingPage = () => {
  return (
    <div>
      <PageHeader title="인사말" description="인사말입니다." />
      <img src={GrettingImage} className="w-full" />
    </div>
  );
};
