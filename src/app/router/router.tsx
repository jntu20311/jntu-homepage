import { createBrowserRouter } from "react-router-dom";
import {
  AboutIntroPage,
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
  PolicyPage,
  PortalPage,
  PressDetailPage,
  PressPage,
  PrivacyPage,
  TermsPage,
} from "@/pages";
import { routes } from "@/shared/configs/routes";
import { RootLayout } from "@/app/layouts/root-layout";
import { BoardLayout } from "../layouts/board-layout";

const router = createBrowserRouter([
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
          { path: routes.ACTIVITIES_POLICY, element: <PolicyPage /> },
          { path: routes.ACTIVITIES_BENEFITS, element: <BenefitsPage /> },

          // 가입하기
          { path: routes.JOIN_MEMBER, element: <JoinMemberPage /> },
          { path: routes.JOIN_SUPPORTER, element: <JoinSupporterPage /> },
          { path: routes.JOIN_UPDATE, element: <JoinUpdatePage /> },
        ],
      },

      // 교사지원포털
      { path: routes.PORTAL, element: <PortalPage /> },

      // 법적 고지
      { path: routes.TERMS, element: <TermsPage /> },
      { path: routes.PRIVACY, element: <PrivacyPage /> },

      // 404 (매칭되지 않는 모든 경로)
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export { router };
