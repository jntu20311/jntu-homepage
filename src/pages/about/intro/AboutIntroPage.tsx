import { PageHeader } from "@/shared/ui/page-header";
import AboutImage from "@/shared/assets/images/img_about.png";

export const AboutIntroPage = () => {
  return (
    <section>
      <PageHeader title="소개" description="전남광주교사노조를 소개합니다." />

      <img src={AboutImage} className="w-full" />
    </section>
  );
};
