import { Link } from "react-router-dom";
import { navItems } from "@/shared/configs/nav";
import { routes } from "@/shared/configs/routes";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link to={routes.ROOT} className="text-lg font-bold tracking-tight">
              JNTU
            </Link>
            <p className="text-sm text-muted-foreground">
              전남대학교 홈페이지에 오신 것을 환영합니다.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">바로가기</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">연락처</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>광주광역시 북구 용봉로 77</li>
              <li>062-530-5114</li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">정보</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>이용약관</li>
              <li>개인정보처리방침</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {year} JNTU. All rights reserved.</p>
          <p>Made with React &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};
