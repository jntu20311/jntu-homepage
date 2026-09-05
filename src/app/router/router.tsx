import { createBrowserRouter } from "react-router-dom";
import { AboutPage, HomePage } from "@/pages";
import { routes } from "@/shared/configs/routes";
import { RootLayout } from "@/app/layouts/root-layout";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: routes.ROOT,
        element: <HomePage />,
      },
      {
        path: routes.ABOUT,
        element: <AboutPage />,
      },
    ],
  },
]);

export { router };
