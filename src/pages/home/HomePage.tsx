import { ImageSlider, type SlideImage } from "@/shared/ui/image-slider";
import { Link } from "react-router-dom";
import type { UseQueryResult } from "@tanstack/react-query";
import {
  routes,
  pressDetailPath,
  activityHistoryDetailPath,
  benefitDetailPath,
} from "@/shared/configs/routes";
import { ArrowRightIcon } from "lucide-react";
import { HomeLinkCard, useHomeLinks } from "@/entities/home-link";
import { useBanners } from "@/entities/banner";
import { usePressPreview } from "@/entities/press";
import { useActivitiesPreview } from "@/entities/activity";
import { useBenefitsPreview } from "@/entities/benefit";
import { formatDate } from "@/shared/lib/format";
import type { PreviewItem } from "@/shared/api/board";

interface HomeBoard {
  title: string;
  link: string;
  detailPath: (id: string) => string;
  usePreview: () => UseQueryResult<PreviewItem[]>;
}

const homeBoards: HomeBoard[] = [
  {
    title: "보도자료",
    link: routes.ACTIVITIES_PRESS,
    detailPath: pressDetailPath,
    usePreview: usePressPreview,
  },
  {
    title: "활동내역",
    link: routes.ACTIVITIES_HISTORY,
    detailPath: activityHistoryDetailPath,
    usePreview: useActivitiesPreview,
  },
  {
    title: "조합원 혜택",
    link: routes.ACTIVITIES_BENEFITS,
    detailPath: benefitDetailPath,
    usePreview: useBenefitsPreview,
  },
];

export const HomePage = () => {
  const { data: banners } = useBanners();
  const { data: homeLinks } = useHomeLinks();

  const slides: SlideImage[] = (banners ?? []).map((b) => ({
    src: b.imageUrl,
    alt: b.alt,
    link: b.link,
    external: b.external,
  }));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {slides.length > 0 ? (
          <ImageSlider className="max-w-[550px]" images={slides} />
        ) : (
          <div className="aspect-[4/5] w-full max-w-[550px] rounded-lg bg-muted" />
        )}
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <p className="text-2xl md:text-4xl font-bold text-primary">
              당당한 교사! 바로 서는 교육!
            </p>
            <p className="text-[34px] md:text-[50px] font-bold">
              전남광주교사노동조합
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 mt-4 md:gap-6 md:mt-8">
            {(homeLinks ?? []).map((el) => (
              <HomeLinkCard key={`link-${el.label}`} data={el} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
        {homeBoards.map((board) => (
          <HomeBoardColumn key={`board-${board.title}`} board={board} />
        ))}
      </div>
    </section>
  );
};

const HomeBoardColumn = ({ board }: { board: HomeBoard }) => {
  const { data: items } = board.usePreview();

  return (
    <div>
      <div className="flex items-center border-b py-2">
        <span className="text-xl font-bold">{board.title}</span>
        <Link
          className="ml-auto flex items-center text-sm font-semibold text-primary gap-1"
          to={board.link}
        >
          {"전체보기"}
          <ArrowRightIcon className="text-primary" size={16} />
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        {(items ?? []).length === 0 ? (
          <p className="py-1 text-sm text-muted-foreground">
            등록된 게시물이 없습니다.
          </p>
        ) : (
          (items ?? []).map((item) => (
            <Link
              key={item.id}
              to={board.detailPath(item.id)}
              className="py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
            >
              <span className="grow truncate">{item.title}</span>
              <span className="text-xs text-gray-600 text-nowrap">
                {formatDate(item.date)}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
