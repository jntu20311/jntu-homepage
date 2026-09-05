import { Link } from "react-router-dom";
import { legalItems, navMenus } from "@/shared/configs/nav";
import { routes } from "@/shared/configs/routes";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link to={routes.ROOT} className="text-lg font-bold tracking-tight">
              전남광주교사노조
            </Link>
            <p className="text-sm text-muted-foreground">
              전남·광주 교사들의 권익을 위한 노동조합입니다.
            </p>
            <address className="space-y-1 text-sm not-italic text-muted-foreground">
              <p>광주광역시 북구 용봉로 77</p>
              <p>062-530-5114</p>
            </address>
          </div>

          {/* Menu columns */}
          {navMenus
            .filter((menu) => menu.items)
            .map((menu) => (
              <div key={menu.label} className="space-y-3">
                <h3 className="text-sm font-semibold">{menu.label}</h3>
                <ul className="space-y-2">
                  {menu.items!.map((item) => (
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
            ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {year} 전남광주교사노조. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            {legalItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
