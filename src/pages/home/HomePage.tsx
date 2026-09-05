import { ImageSlider, type SlideImage } from "@/shared/ui/image-slider";
import slide1 from "@/shared/assets/images/slides/slide-1.svg";
import slide2 from "@/shared/assets/images/slides/slide-2.svg";
import slide3 from "@/shared/assets/images/slides/slide-3.svg";

const slides: SlideImage[] = [
  { src: slide1, alt: "전남광주교사노조" },
  { src: slide2, alt: "함께하는 교사노조" },
  { src: slide3, alt: "당당한 교사, 바로 서는 교육" },
];

export const HomePage = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4">
        <ImageSlider className="max-w-[550px]" images={slides} />
        <div className="flex flex-col justify-center">
          <p className="text-4xl font-bold text-primary">
            당당한 교사! 바로 서는 교육!
          </p>
          <p className="text-5xl font-bold">전남광주교사노동조합</p>
          <div className="grid grid-cols-3">
            <div>조합원 가입</div>
            <div>정보변경</div>
            <div>커뮤니티</div>
          </div>
        </div>
      </div>
    </section>
  );
};
