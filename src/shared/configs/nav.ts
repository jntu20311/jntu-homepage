import { routes } from "@/shared/configs/routes";

export interface NavItem {
  label: string;
  path: string;
}

export interface NavMenu {
  label: string;
  /** 하위 항목이 없는 단일 링크일 때 사용 */
  path?: string;
  items?: NavItem[];
}

export const navMenus: NavMenu[] = [
  {
    label: "전남광주교사노조",
    items: [
      { label: "소개", path: routes.ABOUT_INTRO },
      { label: "위원장 인사말", path: routes.ABOUT_GREETING },
      { label: "오시는길", path: routes.ABOUT_LOCATION },
    ],
  },
  {
    label: "주요활동",
    items: [
      { label: "보도자료 및 성명서", path: routes.ACTIVITIES_PRESS },
      { label: "활동내역", path: routes.ACTIVITIES_HISTORY },
      { label: "교섭·정책", path: routes.ACTIVITIES_POLICY },
      { label: "조합원 혜택", path: routes.ACTIVITIES_BENEFITS },
    ],
  },
  {
    label: "가입하기",
    items: [
      { label: "조합원 가입", path: routes.JOIN_MEMBER },
      { label: "후원회원 가입", path: routes.JOIN_SUPPORTER },
      { label: "정보 변경", path: routes.JOIN_UPDATE },
    ],
  },
  {
    label: "교사지원포털",
    path: routes.PORTAL,
  },
];

/** 푸터 하단 법적 고지 링크 */
export const legalItems: NavItem[] = [
  { label: "이용약관", path: routes.TERMS },
  { label: "개인정보취급방침", path: routes.PRIVACY },
];
