/** ISO 날짜 문자열을 "YYYY.MM.DD" 형식으로 변환합니다. */
export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

/** 숫자를 천 단위 구분 기호가 있는 문자열로 변환합니다. */
export const formatNumber = (value: number): string =>
  value.toLocaleString("ko-KR");
