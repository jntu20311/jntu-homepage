import type { Policy } from "./types";
import img1 from "@/shared/assets/images/activities/activity-1.svg";
import img2 from "@/shared/assets/images/activities/activity-2.svg";
import img3 from "@/shared/assets/images/activities/activity-3.svg";
import img4 from "@/shared/assets/images/activities/activity-4.svg";
import img5 from "@/shared/assets/images/activities/activity-5.svg";
import img6 from "@/shared/assets/images/activities/activity-6.svg";

const images = [img1, img2, img3, img4, img5, img6];
const authors = ["사무국", "정책국", "교섭국", "조직국"];

// 목업 24건 생성 (등록일 내림차순)
export const policies: Policy[] = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1;
  const base = new Date("2025-08-01");
  base.setMonth(base.getMonth() - i);

  const ym = `${base.getFullYear()}년 ${base.getMonth() + 1}월`;

  return {
    id: String(n),
    image: images[i % images.length],
    title: `${ym} 활동보고`,
    createdAt: base.toISOString().slice(0, 10),
    views: 80 + ((n * 29) % 320),
    author: authors[i % authors.length],
    content:
      `${ym} 전남광주교사노동조합의 월별 활동 보고입니다. ` +
      "교섭·정책 활동, 조합원 지원, 대외 협력 등 주요 활동 내역을 정리하였습니다.",
  };
});

export const findPolicy = (id: string): Policy | undefined =>
  policies.find((policy) => policy.id === id);
