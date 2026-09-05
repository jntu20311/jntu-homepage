import { createBrowserRouter } from "react-router-dom";
import { AboutPage, HomePage } from "@/pages";
import { routes } from "@/shared/configs/routes";

const router = createBrowserRouter([
  {
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
