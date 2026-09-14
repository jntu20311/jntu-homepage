/** 관리자 리소스/필드 선언 (config-driven) */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "image"
  | "file"
  | "richtext"
  | "password";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  bucket?: string;
  folder?: string;
  /** file 타입: 파일명을 함께 저장할 컬럼 */
  fileNameField?: string;
  defaultValue?: unknown;
  helper?: string;
  /** 생성 시에만 노출 (예: 비밀번호) */
  createOnly?: boolean;
  /** textarea 옆에 Markdown 미리보기를 병렬 배치 */
  markdown?: boolean;
}

export interface ColumnDef {
  name: string;
  label: string;
  type?: "text" | "date" | "boolean" | "image" | "badge";
  /** 값 → 표시 라벨 매핑 (예: slug terms→이용약관) */
  map?: Record<string, string>;
}

export interface ResourceDef {
  name: string;
  label: string;
  list: ColumnDef[];
  fields: FieldDef[];
  dataProviderName?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  sorter?: { field: string; order: "asc" | "desc" };
  /** richtext(CKEditor) 이미지 업로드 경로 구분 */
  postType?: string;
  /** 기본 키 컬럼명이 id 가 아닐 때 (예: terms.slug) */
  idColumnName?: string;
  /** 생성 시 작성자를 로그인한 관리자와 연동 (author_id → admins.id 추적용, author → 이름 스냅샷) */
  autoAuthor?: boolean;
}

/** 게시판 3종(활동내역/월별활동보고/조합원혜택) 공통 필드 */
const boardFields = (): FieldDef[] => [
  { name: "title", label: "제목", type: "text", required: true },
  {
    name: "image_url",
    label: "대표 이미지",
    type: "image",
    bucket: "board",
    folder: "images",
    required: true,
  },
  { name: "content", label: "본문 (선택)", type: "textarea" },
  { name: "published", label: "공개", type: "boolean", defaultValue: true },
  { name: "created_at", label: "등록일", type: "date" },
];

const boardColumns: ColumnDef[] = [
  { name: "id", label: "번호" },
  { name: "title", label: "제목" },
  { name: "created_at", label: "등록일", type: "date" },
  { name: "published", label: "공개", type: "boolean" },
];

export const resources: ResourceDef[] = [
  {
    name: "banners",
    label: "홈 배너",
    sorter: { field: "sort_order", order: "asc" },
    list: [
      { name: "sort_order", label: "순서" },
      { name: "image_url", label: "이미지", type: "image" },
      {
        name: "alt",
        label: "대체 텍스트 (이미지 미노출 시 표시되는 텍스트입니다.)",
      },
      { name: "link", label: "링크" },
      { name: "active", label: "노출", type: "boolean" },
    ],
    fields: [
      {
        name: "image_url",
        label: "배너 이미지 (1080 x 1350)",
        type: "image",
        bucket: "banners",
        folder: "images",
        required: true,
      },
      {
        name: "alt",
        label: "대체 텍스트 (이미지 미노출 시 표시되는 텍스트입니다.)",
        type: "text",
      },
      {
        name: "link",
        label: "이동할 링크 (배너 이미지 클릭 시 이동할 페이지 주소)",
        type: "text",
        helper: "비우면 링크 없음",
      },
      {
        name: "external",
        label:
          "새 탭에서 열기 여부 (체크 시, 배너 클릭 시 새 탭에서 페이지가 열립니다.)",
        type: "boolean",
      },
      {
        name: "sort_order",
        label: "정렬 순서",
        type: "number",
        defaultValue: 0,
      },
      {
        name: "active",
        label: "화면 노출 여부",
        type: "boolean",
        defaultValue: true,
      },
    ],
  },
  // {
  //   name: "home_links",
  //   label: "홈 바로가기",
  //   sorter: { field: "sort_order", order: "asc" },
  //   list: [
  //     { name: "label", label: "라벨" },
  //     { name: "link", label: "링크" },
  //     { name: "active", label: "노출", type: "boolean" },
  //   ],
  //   fields: [
  //     { name: "label", label: "라벨", type: "text", required: true },
  //     { name: "link", label: "링크", type: "text", required: true },
  //     { name: "external", label: "외부 링크(새 탭)", type: "boolean" },
  //     {
  //       name: "sort_order",
  //       label: "정렬 순서",
  //       type: "number",
  //       defaultValue: 0,
  //     },
  //     { name: "active", label: "노출", type: "boolean", defaultValue: true },
  //   ],
  // },
  {
    name: "press",
    label: "보도자료",
    sorter: { field: "press_date", order: "desc" },
    postType: "press",
    autoAuthor: true,
    list: [
      { name: "id", label: "번호" },
      { name: "type", label: "유형", type: "badge" },
      { name: "title", label: "제목" },
      { name: "press_date", label: "보도날짜", type: "date" },
    ],
    fields: [
      {
        name: "type",
        label: "유형",
        type: "select",
        options: [
          { label: "전남광주", value: "전남광주" },
          { label: "연맹", value: "연맹" },
        ],
        defaultValue: "전남광주",
        required: true,
      },
      { name: "title", label: "제목", type: "text", required: true },
      { name: "press_date", label: "보도날짜", type: "date", required: true },
      {
        name: "attachment_url",
        label: "첨부파일",
        type: "file",
        bucket: "board",
        folder: "files",
        fileNameField: "attachment_name",
      },
      { name: "content", label: "본문", type: "richtext" },
      { name: "published", label: "공개", type: "boolean", defaultValue: true },
    ],
  },
  {
    name: "activities",
    label: "활동내역",
    sorter: { field: "created_at", order: "desc" },
    postType: "activities",
    autoAuthor: true,
    list: boardColumns,
    fields: boardFields(),
  },
  {
    name: "month_activities",
    label: "월별활동보고",
    sorter: { field: "created_at", order: "desc" },
    postType: "month_activities",
    autoAuthor: true,
    list: boardColumns,
    fields: boardFields(),
  },
  {
    name: "benefits",
    label: "조합원 혜택",
    sorter: { field: "created_at", order: "desc" },
    postType: "benefits",
    autoAuthor: true,
    list: boardColumns,
    fields: boardFields(),
  },
  {
    name: "terms",
    label: "약관",
    sorter: { field: "effective_date", order: "desc" },
    list: [
      {
        name: "slug",
        label: "구분",
        type: "badge",
        map: { terms: "이용약관", privacy: "개인정보처리방침" },
      },
      { name: "title", label: "제목" },
      { name: "effective_date", label: "적용날짜", type: "date" },
      { name: "updated_at", label: "수정일", type: "date" },
    ],
    fields: [
      {
        name: "slug",
        label: "구분",
        type: "select",
        required: true,
        options: [
          { label: "이용약관", value: "terms" },
          { label: "개인정보처리방침", value: "privacy" },
        ],
        defaultValue: "terms",
      },
      { name: "title", label: "제목", type: "text", required: true },
      {
        name: "effective_date",
        label: "적용(시행)날짜",
        type: "date",
        required: true,
      },
      {
        name: "content",
        label: "본문 (Markdown)",
        type: "textarea",
        markdown: true,
        helper:
          "왼쪽에 Markdown 으로 작성하면 오른쪽에서 미리보기가 갱신됩니다.",
      },
    ],
  },
  {
    name: "admins",
    label: "관리자 계정",
    dataProviderName: "adminUsers",
    canEdit: false,
    list: [
      { name: "email", label: "이메일" },
      { name: "name", label: "이름" },
      { name: "is_protected", label: "기본계정", type: "boolean" },
    ],
    fields: [
      { name: "email", label: "이메일", type: "text", required: true },
      {
        name: "password",
        label: "비밀번호",
        type: "password",
        required: true,
        createOnly: true,
      },
      { name: "name", label: "이름", type: "text" },
    ],
  },
];

export const getResource = (name: string): ResourceDef | undefined =>
  resources.find((r) => r.name === name);
