import type { Press, PressType } from "./types";
import pressImage from "@/shared/assets/images/activities/activity-2.svg";
import sampleFile from "@/shared/assets/files/press-sample.txt?url";

const types: PressType[] = ["연맹", "전남광주"];

const titles = [
  "교원 처우개선 촉구 성명 발표",
  "교권 침해 대응 관련 입장문",
  "학교 현장 안전 강화 요구 보도자료",
  "단체교섭 결과 브리핑",
  "교육 예산 확대 촉구 기자회견",
  "비정규직 차별 철폐 성명",
  "돌봄교실 정책 개선 요구",
  "교사 정치기본권 보장 촉구",
  "신학기 교육정책 논평",
  "지방교육재정 확보 촉구 성명",
];

const buildContent = (title: string) =>
  `
    <h2>${title}</h2>
    <p>전남광주교사노동조합은 아래와 같이 <strong>${title}</strong> 관련 보도자료를 배포합니다.</p>
    <img src="${pressImage}" alt="보도자료 이미지" />
    <p>
      우리 조합은 교육 현장의 목소리를 바탕으로 조합원의 권익 보호와
      교육 환경 개선을 위해 지속적으로 활동하고 있습니다. 관계 기관의
      전향적인 검토와 조치를 촉구합니다.
    </p>
    <ul>
      <li>교원의 교육활동 보호 강화</li>
      <li>합리적인 근무여건 조성</li>
      <li>교육 예산의 안정적 확보</li>
    </ul>
    <p>문의: 전남광주교사노동조합 사무국</p>
  `.trim();

// 목업 42건 생성 (보도날짜 내림차순)
export const pressReleases: Press[] = Array.from({ length: 42 }, (_, i) => {
  const n = 42 - i;
  const base = new Date("2025-08-29");
  base.setDate(base.getDate() - i * 5);
  const title = `${titles[i % titles.length]}`;
  const hasAttachment = i % 3 !== 0; // 3건 중 2건은 첨부파일 있음

  return {
    id: String(n),
    type: types[i % types.length],
    title,
    pressDate: base.toISOString().slice(0, 10),
    attachment: hasAttachment
      ? { name: `보도자료_${n}.txt`, url: sampleFile }
      : undefined,
    content: buildContent(title),
  };
});

export const findPress = (id: string): Press | undefined =>
  pressReleases.find((press) => press.id === id);
