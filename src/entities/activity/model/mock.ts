import type { Activity } from "./types";
import activity1 from "@/shared/assets/images/activities/activity-1.svg";
import activity2 from "@/shared/assets/images/activities/activity-2.svg";
import activity3 from "@/shared/assets/images/activities/activity-3.svg";
import activity4 from "@/shared/assets/images/activities/activity-4.svg";
import activity5 from "@/shared/assets/images/activities/activity-5.svg";
import activity6 from "@/shared/assets/images/activities/activity-6.svg";

const images = [
  activity1,
  activity2,
  activity3,
  activity4,
  activity5,
  activity6,
];

const titles = [
  "신학기 교원 처우개선 간담회 개최",
  "교권 보호 정책 토론회 참석",
  "조합원 역량 강화 워크숍 진행",
  "지역 교육청과의 단체교섭 회의",
  "조합원 문화행사 안내",
  "신규 조합원 환영 오리엔테이션",
  "교육 현안 대응 긴급 회의",
  "학교 비정규직 처우개선 캠페인",
  "교사 노동권 세미나 개최",
  "지부 정기 대의원회의 진행",
];

const authors = [
  "사무국",
  "정책국",
  "교육국",
  "교섭국",
  "복지국",
  "조직국",
];

// 목업 50건 생성 (등록일 내림차순)
export const activities: Activity[] = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;
  const base = new Date("2025-08-31");
  base.setDate(base.getDate() - i * 3);

  return {
    id: String(n),
    image: images[i % images.length],
    title: `${titles[i % titles.length]} (${n}회차)`,
    createdAt: base.toISOString().slice(0, 10),
    views: 120 + ((n * 37) % 480),
    author: authors[i % authors.length],
    content:
      `${titles[i % titles.length]} 관련 활동 내용입니다. ` +
      "전남광주교사노조는 조합원의 권익 보호와 교육 환경 개선을 위해 " +
      "다양한 활동을 이어가고 있습니다.",
  };
});

export const findActivity = (id: string): Activity | undefined =>
  activities.find((activity) => activity.id === id);
