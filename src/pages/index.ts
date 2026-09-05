import { lazy, type ComponentType } from "react";

const lazyNamed = <T extends Record<string, ComponentType<unknown>>>(
  factory: () => Promise<T>,
  name: keyof T,
) => lazy(() => factory().then((m) => ({ default: m[name] })));

// 홈
export const HomePage = lazyNamed(() => import("./home/HomePage"), "HomePage");

// 전남광주교사노조
export const AboutIntroPage = lazyNamed(
  () => import("./about/intro/AboutIntroPage"),
  "AboutIntroPage",
);
export const GreetingPage = lazyNamed(
  () => import("./about/greeting/GreetingPage"),
  "GreetingPage",
);
export const LocationPage = lazyNamed(
  () => import("./about/location/LocationPage"),
  "LocationPage",
);

// 주요활동
export const PressPage = lazyNamed(
  () => import("./activities/press/PressPage"),
  "PressPage",
);
export const HistoryPage = lazyNamed(
  () => import("./activities/history/HistoryPage"),
  "HistoryPage",
);
export const HistoryDetailPage = lazyNamed(
  () => import("./activities/history/detail/HistoryDetailPage"),
  "HistoryDetailPage",
);
export const PolicyPage = lazyNamed(
  () => import("./activities/policy/PolicyPage"),
  "PolicyPage",
);
export const BenefitsPage = lazyNamed(
  () => import("./activities/benefits/BenefitsPage"),
  "BenefitsPage",
);

// 가입하기
export const JoinMemberPage = lazyNamed(
  () => import("./join/member/JoinMemberPage"),
  "JoinMemberPage",
);
export const JoinSupporterPage = lazyNamed(
  () => import("./join/supporter/JoinSupporterPage"),
  "JoinSupporterPage",
);
export const JoinUpdatePage = lazyNamed(
  () => import("./join/update/JoinUpdatePage"),
  "JoinUpdatePage",
);

// 교사지원포털
export const PortalPage = lazyNamed(
  () => import("./portal/PortalPage"),
  "PortalPage",
);

// 법적 고지
export const TermsPage = lazyNamed(
  () => import("./legal/terms/TermsPage"),
  "TermsPage",
);
export const PrivacyPage = lazyNamed(
  () => import("./legal/privacy/PrivacyPage"),
  "PrivacyPage",
);
