export interface Policy {
  id: string;
  /** 대표 이미지 */
  image: string;
  /** 제목 */
  title: string;
  /** 등록일 (ISO 8601) */
  createdAt: string;
  /** 조회수 */
  views: number;
  /** 작성자 */
  author: string;
  /** 상세 본문 */
  content: string;
}
