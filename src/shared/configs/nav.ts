import { routes } from "@/shared/configs/routes";

export interface NavItem {
  label: string;
  path: string;
}

export const navItems: NavItem[] = [
  { label: "홈", path: routes.ROOT },
  { label: "소개", path: routes.ABOUT },
];
