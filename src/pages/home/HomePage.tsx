import { ImageSlider } from "@/shared/ui/image-slider";
import { Link } from "react-router-dom";
import {
  routes,
  pressDetailPath,
  activityHistoryDetailPath,
  benefitDetailPath,
} from "@/shared/configs/routes";
import { ArrowRightIcon } from "lucide-react";
import { HomeLinkCard } from "@/entities/home-link";
import { formatDate } from "@/shared/lib/format";
import { useAsync } from "@/shared/lib/use-async";
import {
  fetchBanners,
  fetchHomeLinks,
  fetchBoardPreview,
  type PreviewItem,
} from "@/shared/lib/home-api";

interface HomeBoard {
  title: string;
  link: string;
  table: string;
  dateColumn: string;
  detailPath: (id: string) => string;
}

const homeBoards: HomeBoard[] = [
  {
    title: "보도자료",
    link: routes.ACTIVITIES_PRESS,
    table: "press",
    dateColumn: "press_date",
    detailPath: pressDetailPath,
  },
  {
    title: "활동내역",
    link: routes.ACTIVITIES_HISTORY,
    table: "activities",
    dateColumn: "created_at",
    detailPath: activityHistoryDetailPath,
  },
  {
    title: "조합원 혜택",
    link: routes.ACTIVITIES_BENEFITS,
    table: "benefits",
    dateColumn: "created_at",
    detailPath: benefitDetailPath,
  },
];

export const HomePage = () => {
  const { data: slides } = useAsync(fetchBanners, []);
  const { data: homeLinks } = useAsync(fetchHomeLinks, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {slides && slides.length > 0 ? (
          <ImageSlider className="max-w-[550px]" images={slides} />
        ) : (
          <div className="aspect-video w-full max-w-[550px] rounded-lg bg-muted" />
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
  const { data: items } = useAsync<PreviewItem[]>(
    () => fetchBoardPreview(board.table, board.dateColumn, 5),
    [board.table],
  );

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
