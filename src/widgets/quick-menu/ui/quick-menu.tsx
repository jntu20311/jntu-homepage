import { ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight, PhoneIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import KakaoChannelIcon from "@/shared/assets/images/kakao-channel.png";
import { AppIcon } from "@/shared/ui/app-icon";
import { CONSTANTS } from "@/shared/configs/constants";

interface QuickMenuItem {
  label: string;
  link: string;
  icon: ReactNode;
}

const quickItems: QuickMenuItem[] = [
  {
    label: "조합원 가입",
    link: CONSTANTS.BANKCMS_LINK,
    icon: <AppIcon className="size-7 shrink-0 text-primary" />,
  },
  {
    label: "카카오채널",
    link: CONSTANTS.KAKAO_CHANNEL,
    icon: <img src={KakaoChannelIcon} className="size-7 shrink-0" />,
  },
];

const STORAGE_KEY = "quick-menu-open";
const PANEL_ID = "quick-menu-panel";

const getInitialOpen = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const QuickMenu = () => {
  const [open, setOpen] = useState<boolean>(getInitialOpen);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // 무시
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        // 탭 + 패널을 함께 좌우로 슬라이드 (접힘: 패널 폭만큼 오른쪽으로 밀어 숨김)
        "fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "translate-x-40",
      )}
    >
      {/* 접기/펴기 탭 */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={open ? "퀵메뉴 접기" : "퀵메뉴 펼치기"}
        className="flex w-11 flex-col items-center self-stretch overflow-hidden rounded-l-xl bg-primary text-white shadow-lg transition-colors hover:bg-primary-700"
      >
        <span className="flex flex-1 items-center justify-center py-6 text-sm font-bold tracking-[0.2em] [writing-mode:vertical-rl]">
          QUICK MENU
        </span>
        <span className="flex w-full items-center justify-center bg-blue-950 py-3">
          {open ? (
            <ChevronRight className="size-5" />
          ) : (
            <ChevronLeft className="size-5" />
          )}
        </span>
      </button>

      {/* 펼침 상태 패널 (탭에 붙어 함께 이동) */}
      <div
        id={PANEL_ID}
        inert={!open}
        className="w-40 border border-l-0 border-border bg-card shadow-xl"
      >
        <div className="px-5 pt-2">
          <p className="text-md font-bold tracking-tight text-center">
            <span className="text-primary">전남교사노조</span>
          </p>
        </div>
        <ul className="px-2 pb-2">
          {quickItems.map((item) => {
            return (
              <li
                key={item.link}
                className="border-b border-border/70 last:border-b-0"
              >
                <a
                  href={item.link}
                  target="_blank"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}

          <li
            key={"quick-phone"}
            className="border-b border-border/70 last:border-b-0"
          >
            <div className="flex flex-col items-center rounded-lg pt-1.5 text-sm font-medium text-foreground transition-colors">
              {/* 대표번호 */}
              <div className="flex items-center gap-1 mr-4">
                <PhoneIcon className="size-4.5 shrink-0 text-primary" />
                <span className="whitespace-pre-wrap text-center font-semibold text-[14px]">
                  {"대표번호"}
                </span>
              </div>
              <span className="text-[16px] font-semibold text-primary">
                {"010-0000-0000"}
              </span>

              {/* 영업시간 */}
              <span className="whitespace-pre-wrap text-center text-gray-500">
                {"평일 09:00~17:00\n주말/공휴일 휴무"}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
