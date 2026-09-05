export const routes = {
  ROOT: "/",

  // 전남광주교사노조
  ABOUT_INTRO: "/about/intro",
  ABOUT_GREETING: "/about/greeting",
  ABOUT_LOCATION: "/about/location",

  // 주요활동 (알림마당)
  ACTIVITIES_PRESS: "/activities/press",
  ACTIVITIES_PRESS_DETAIL: "/activities/press/:id",
  ACTIVITIES_HISTORY: "/activities/history",
  ACTIVITIES_HISTORY_DETAIL: "/activities/history/:id",
  ACTIVITIES_POLICY: "/activities/policy",
  ACTIVITIES_POLICY_DETAIL: "/activities/policy/:id",
  ACTIVITIES_BENEFITS: "/activities/benefits",
  ACTIVITIES_BENEFITS_DETAIL: "/activities/benefits/:id",

  // 가입하기 (가입/변경) - 외부 링크 확인 후 링크 및 페이지 제거
  JOIN_MEMBER: "/join/member",
  JOIN_SUPPORTER: "/join/supporter",
  JOIN_UPDATE: "/join/update",

  // 이용약관 / 개인정보취급방침 (footer)
  TERMS: "/terms",
  PRIVACY: "/privacy",
} as const;

/** 활동내역 상세 페이지 경로를 생성합니다. */
export const activityHistoryDetailPath = (id: string) =>
  `/activities/history/${id}`;

/** 보도자료 상세 페이지 경로를 생성합니다. */
export const pressDetailPath = (id: string) => `/activities/press/${id}`;

/** 월별활동보고 상세 페이지 경로를 생성합니다. */
export const policyDetailPath = (id: string) => `/activities/policy/${id}`;

/** 조합원 혜택 상세 페이지 경로를 생성합니다. */
export const benefitDetailPath = (id: string) => `/activities/benefits/${id}`;
