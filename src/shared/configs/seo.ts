import { routes } from "./routes";

export const SITE_NAME = "전남광주교사노동조합";
export const DEFAULT_DESCRIPTION = "당당한 교사! 바로 서는 교육! 전남광주교사노동조합";

interface PageMeta {
  title: string;
  description: string;
}

/** 정확히 일치하는 경로의 메타 정보 */
const PAGE_META: Record<string, PageMeta> = {
  [routes.ABOUT_INTRO]: {
    title: "조합 소개",
    description: "교사의 권리와 교육의 본질을 지키는 전남광주교사노동조합을 소개합니다.",
  },
  [routes.ABOUT_GREETING]: {
    title: "인사말",
    description: "전남광주교사노동조합 위원장 인사말입니다.",
  },
  [routes.ABOUT_LOCATION]: {
    title: "오시는 길",
    description: "전남광주교사노동조합 사무실 위치와 오시는 길을 안내합니다.",
  },
  [routes.ACTIVITIES_PRESS]: {
    title: "보도자료 및 성명서",
    description: "전남광주교사노동조합의 보도자료와 성명서를 확인하세요.",
  },
  [routes.ACTIVITIES_HISTORY]: {
    title: "주요활동",
    description: "전남광주교사노동조합의 주요 활동 소식을 확인하세요.",
  },
  [routes.ACTIVITIES_MONTH_ACTIVITY]: {
    title: "월별활동보고",
    description: "전남광주교사노동조합의 월별 활동 보고를 확인하세요.",
  },
  [routes.ACTIVITIES_BENEFITS]: {
    title: "조합원 혜택",
    description: "전남광주교사노동조합 조합원을 위한 혜택을 안내합니다.",
  },
  [routes.JOIN_MEMBER]: {
    title: "조합원 가입",
    description: "전남광주교사노동조합 조합원 가입 방법을 안내합니다.",
  },
  [routes.JOIN_SUPPORTER]: {
    title: "후원회원 가입",
    description: "전남광주교사노동조합 후원회원 가입 방법을 안내합니다.",
  },
  [routes.JOIN_UPDATE]: {
    title: "가입 정보 변경",
    description: "전남광주교사노동조합 가입 정보 변경 방법을 안내합니다.",
  },
  [routes.TERMS]: {
    title: "이용약관",
    description: "전남광주교사노동조합 홈페이지 이용약관입니다.",
  },
  [routes.PRIVACY]: {
    title: "개인정보처리방침",
    description: "전남광주교사노동조합의 개인정보처리방침입니다.",
  },
};

/** 상세 페이지(/activities/press/:id 등)는 상위 목록의 메타를 따라간다. */
const DETAIL_PARENTS = [
  routes.ACTIVITIES_PRESS,
  routes.ACTIVITIES_HISTORY,
  routes.ACTIVITIES_MONTH_ACTIVITY,
  routes.ACTIVITIES_BENEFITS,
];

export const getPageMeta = (pathname: string): PageMeta => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const hit =
    PAGE_META[path] ??
    PAGE_META[DETAIL_PARENTS.find((p) => path.startsWith(`${p}/`)) ?? ""];

  if (!hit) return { title: SITE_NAME, description: DEFAULT_DESCRIPTION };
  return {
    title: `${hit.title} | ${SITE_NAME}`,
    description: hit.description,
  };
};
