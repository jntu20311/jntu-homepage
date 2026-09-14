import { NavLink, useLocation } from "react-router-dom";
import { findMenuByPath } from "@/shared/configs/nav";
import { cn } from "@/shared/lib/utils";

export const BoardSubMenu = () => {
  const { pathname } = useLocation();
  const menu = findMenuByPath(pathname);

  if (!menu?.items) return null;

  return (
    <aside className="w-full md:w-56 md:shrink-0">
      {/* MainTitle */}
      <h2 className="flex items-center gap-2 border-b border-border pb-3 text-xl font-bold tracking-tight md:pb-4 md:text-2xl">
        <span className="hidden h-6 w-1 rounded-full bg-primary md:inline-block" />
        {menu.label}
      </h2>

      {/* submenu */}
      <nav className="mt-3 md:mt-4">
        <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:gap-0.5 md:overflow-visible md:px-0 md:pb-0">
          {menu.items.map((item) => (
            <li key={`${item.label}`} className="shrink-0 md:shrink">
              <NavLink
                to={item.path}
                target={item.external ? "_blank" : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors md:rounded-lg",
                    isActive
                      ? "bg-primary/10 text-primary md:font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity md:block",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
