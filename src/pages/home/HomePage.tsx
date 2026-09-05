import { ImageSlider, type SlideImage } from "@/shared/ui/image-slider";
import slide1 from "@/shared/assets/images/slides/slide-1.svg";
import slide2 from "@/shared/assets/images/slides/slide-2.svg";
import slide3 from "@/shared/assets/images/slides/slide-3.svg";
import { Link } from "react-router-dom";
import { routes } from "@/shared/configs/routes";
import { ArrowRightIcon } from "lucide-react";

const slides: SlideImage[] = [
  { src: slide1, alt: "전남광주교사노조" },
  { src: slide2, alt: "함께하는 교사노조" },
  { src: slide3, alt: "당당한 교사, 바로 서는 교육" },
];

type HomeLink = {
  label: string;
  link: string;
  external?: boolean;
};

const homeLinks: HomeLink[] = [
  { label: "조합원 가입", link: routes.JOIN_MEMBER },
  { label: "정보변경", link: routes.JOIN_UPDATE },
  // { label: "커뮤니티", link: CONSTANTS.INSTAGRAM, external: true },
];

type HomeBoard = {
  title: string;
  link: string;
  items: string[];
};

const homeBoards: HomeBoard[] = [
  { title: "보도자료", link: routes.ACTIVITIES_PRESS, items: [] },
  { title: "활동내역", link: routes.ACTIVITIES_HISTORY, items: [] },
  { title: "조합원 혜택", link: routes.ACTIVITIES_BENEFITS, items: [] },
];

export const HomePage = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageSlider className="max-w-[550px]" images={slides} />
        <div className="flex flex-col justify-center">
          <p className="text-2xl md:text-4xl font-bold text-primary">
            당당한 교사! 바로 서는 교육!
          </p>
          <p className="text-3xl md:text-5xl font-bold">전남광주교사노동조합</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {homeLinks.map((el) => (
              <Link to={el.link} key={`homelink-${el.link}`}>
                <div className="flex items-center justify-center rounded-md border py-4 hover:bg-gray-100">
                  {el.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
        {homeBoards.map((el) => {
          return (
            <div key={`board-${el.title}`}>
              <div className="flex items-center border-b py-2">
                <span className="text-xl font-bold">{el.title}</span>
                <Link
                  className="ml-auto flex items-center text-sm font-semibold text-primary gap-1"
                  to={el.link}
                >
                  {"전체보기"}
                  <ArrowRightIcon className="text-primary" size={16} />
                </Link>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                {[1, 2, 3, 4, 5].map((num) => {
                  return (
                    <div
                      key={`${el.title}-${num}`}
                      className="py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                    >
                      <span className="grow truncate">{`${el.title} 게시물 제목 표시되는 곳입니다 ${num}`}</span>
                      <span className="text-xs text-gray-600 text-nowrap">{`2026-09-08`}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
