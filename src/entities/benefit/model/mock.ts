import type { Benefit } from "./types";
import img1 from "@/shared/assets/images/activities/activity-1.svg";
import img2 from "@/shared/assets/images/activities/activity-2.svg";
import img3 from "@/shared/assets/images/activities/activity-3.svg";
import img4 from "@/shared/assets/images/activities/activity-4.svg";
import img5 from "@/shared/assets/images/activities/activity-5.svg";
import img6 from "@/shared/assets/images/activities/activity-6.svg";

const images = [img1, img2, img3, img4, img5, img6];

const titles = [
  "제휴 병원 진료비 할인 안내",
  "조합원 전용 복지몰 오픈",
  "경조사 지원금 안내",
  "문화·공연 티켓 할인 혜택",
  "연수원·숙박시설 이용 할인",
  "단체 상해보험 가입 지원",
  "교육 도서 구입비 지원",
  "제휴 카페·음식점 할인",
];

const authors = ["복지국", "사무국", "조직국"];

// 목업 20건 생성 (등록일 내림차순)
export const benefits: Benefit[] = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  const base = new Date("2025-08-20");
  base.setDate(base.getDate() - i * 7);

  return {
    id: String(n),
    image: images[i % images.length],
    title: `${titles[i % titles.length]} (${n})`,
    createdAt: base.toISOString().slice(0, 10),
    views: 60 + ((n * 41) % 300),
    author: authors[i % authors.length],
    content:
      `${titles[i % titles.length]} 관련 안내입니다. ` +
      "조합원이라면 누구나 이용하실 수 있으며, 자세한 이용 방법은 사무국으로 문의해 주세요.",
  };
});

export const findBenefit = (id: string): Benefit | undefined =>
  benefits.find((benefit) => benefit.id === id);
