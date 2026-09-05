import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";
import { legalItems } from "@/shared/configs/nav";
import { routes } from "@/shared/configs/routes";
import { Logo } from "@/shared/ui/logo";
import { BandIcon, InstagramIcon, KakaoIcon } from "@/shared/ui/social-icons";
import { CONSTANTS } from "@/shared/configs/constants";

interface SnsLink {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

// TODO: href를 실제 SNS 채널 주소로 교체하세요.
const snsLinks: SnsLink[] = [
  { label: "인스타그램", href: CONSTANTS.INSTAGRAM, icon: InstagramIcon },
  { label: "카카오채널", href: CONSTANTS.KAKAO_CHANNEL, icon: KakaoIcon },
  { label: "네이버밴드", href: CONSTANTS.NAVER_BAND, icon: BandIcon },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"> */}
        <div className="gap-8">
          {/* Brand */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link to={routes.ROOT} className="text-lg font-bold tracking-tight">
              <Logo className="w-50 md:w-65" />
            </Link>

            <div className="md:flex md:items-end">
              <address className="w-full text-sm not-italic text-muted-foreground mt-4 flex flex-col gap-y-1">
                <div className="flex items-center gap-x-4">
                  <p>{CONSTANTS.REPRESENTATIVE}</p>
                  <p>{CONSTANTS.NUMBER}</p>
                </div>
                <p>{CONSTANTS.ADDRESS}</p>
                <p>{CONSTANTS.TEL}</p>
              </address>

              {/* SNS 링크 */}
              <ul className="flex items-center gap-3 mt-4">
                {snsLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Menu columns */}
          {/* {navMenus
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
            ))} */}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>{CONSTANTS.COPYRIGHT}</p>
          <nav className="flex items-center gap-4">
            {legalItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-foreground ${item.path == routes.PRIVACY && "font-semibold"}`}
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
