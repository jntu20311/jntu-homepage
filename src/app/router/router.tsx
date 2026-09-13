import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import {
  AboutIntroPage,
  BenefitsDetailPage,
  BenefitsPage,
  ErrorPage,
  GreetingPage,
  HistoryDetailPage,
  HistoryPage,
  HomePage,
  JoinMemberPage,
  JoinSupporterPage,
  JoinUpdatePage,
  LocationPage,
  NotFoundPage,
  MonthActivityDetailPage,
  MonthActivityPage,
  PressDetailPage,
  PressPage,
  PrivacyPage,
  TermsPage,
} from "@/pages";
import { routes } from "@/shared/configs/routes";
import { RootLayout } from "@/app/layouts/root-layout";
import { BoardLayout } from "../layouts/board-layout";

// 관리자 페이지(Refine + MUI 없는 헤드리스)는 별도 번들로 lazy 로드
const AdminApp = lazy(() => import("@/admin/AdminApp"));

const router = createBrowserRouter([
  // 관리자: 공개 사이트 레이아웃(헤더/푸터) 바깥에서 자체 라우팅
  {
    path: "/admin/*",
    element: (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ),
  },
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, path: routes.ROOT, element: <HomePage /> },

      {
        element: <BoardLayout />,
        children: [
          // 전남광주교사노조
          { path: routes.ABOUT_INTRO, element: <AboutIntroPage /> },
          { path: routes.ABOUT_GREETING, element: <GreetingPage /> },
          { path: routes.ABOUT_LOCATION, element: <LocationPage /> },

          // 주요활동
          { path: routes.ACTIVITIES_PRESS, element: <PressPage /> },
          {
            path: routes.ACTIVITIES_PRESS_DETAIL,
            element: <PressDetailPage />,
          },
          { path: routes.ACTIVITIES_HISTORY, element: <HistoryPage /> },
          {
            path: routes.ACTIVITIES_HISTORY_DETAIL,
            element: <HistoryDetailPage />,
          },

          {
            path: routes.ACTIVITIES_MONTH_ACTIVITY,
            element: <MonthActivityPage />,
          },
          {
            path: routes.ACTIVITIES_MONTH_ACTIVITY_DETAIL,
            element: <MonthActivityDetailPage />,
          },
          { path: routes.ACTIVITIES_BENEFITS, element: <BenefitsPage /> },
          {
            path: routes.ACTIVITIES_BENEFITS_DETAIL,
            element: <BenefitsDetailPage />,
          },

          // 가입하기
          { path: routes.JOIN_MEMBER, element: <JoinMemberPage /> },
          { path: routes.JOIN_SUPPORTER, element: <JoinSupporterPage /> },
          { path: routes.JOIN_UPDATE, element: <JoinUpdatePage /> },
        ],
      },

      // 법적 고지
      { path: routes.TERMS, element: <TermsPage /> },
      { path: routes.PRIVACY, element: <PrivacyPage /> },

      // 404 (매칭되지 않는 모든 경로)
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export { router };
