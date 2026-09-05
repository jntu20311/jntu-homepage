export type PressType = "연맹" | "전남광주";

export interface Attachment {
  /** 표시용 파일명 */
  name: string;
  /** 다운로드 링크 */
  url: string;
}

export interface Press {
  id: string;
  /** 유형 */
  type: PressType;
  /** 제목 */
  title: string;
  /** 보도날짜 (ISO 8601) */
  pressDate: string;
  /** 첨부파일 (최대 1개, 없을 수 있음) */
  attachment?: Attachment;
  /** 내용 (이미지·텍스트를 포함하는 HTML) */
  content: string;
}
