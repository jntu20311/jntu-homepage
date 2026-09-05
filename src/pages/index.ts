import { lazy } from "react";

const HomePage = lazy(() =>
  import("./home/HomePage").then(({ HomePage }) => ({
    default: HomePage,
  })),
);

const AboutPage = lazy(() =>
  import("./about/AboutPage").then(({ AboutPage }) => ({
    default: AboutPage,
  })),
);

export { HomePage, AboutPage };
