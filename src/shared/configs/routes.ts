export const routes = {
  ROOT: "/",

  // 전남광주교사노조
  ABOUT_INTRO: "/about/intro",
  ABOUT_GREETING: "/about/greeting",
  ABOUT_LOCATION: "/about/location",

  // 주요활동 (알림마당)
  ACTIVITIES_PRESS: "/activities/press",
  ACTIVITIES_HISTORY: "/activities/history",
  ACTIVITIES_HISTORY_DETAIL: "/activities/history/:id",
  ACTIVITIES_POLICY: "/activities/policy",
  ACTIVITIES_BENEFITS: "/activities/benefits",

  // 가입하기 (가입/변경)
  JOIN_MEMBER: "/join/member",
  JOIN_SUPPORTER: "/join/supporter",
  JOIN_UPDATE: "/join/update",

  // 교사지원포털
  PORTAL: "/portal",

  // 이용약관 / 개인정보취급방침 (footer)
  TERMS: "/terms",
  PRIVACY: "/privacy",
} as const;

/** 활동내역 상세 페이지 경로를 생성합니다. */
export const activityHistoryDetailPath = (id: string) =>
  `/activities/history/${id}`;
