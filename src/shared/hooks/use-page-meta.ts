import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMeta } from "@/shared/configs/seo";

const setMeta = (selector: string, attr: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute(attr, value);
};

/** 현재 경로에 맞춰 title / description / OG 메타를 갱신한다. */
export const usePageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = getPageMeta(pathname);
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
  }, [pathname]);
};
