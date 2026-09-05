import { createBrowserRouter } from "react-router-dom";
import { routes } from "../../shared/configs/routes";
import { AboutPage, HomePage } from "../../pages";

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
