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
      <h2 className="border-b border-border pb-3 text-xl font-bold tracking-tight md:pb-4 md:text-2xl">
        {menu.label}
      </h2>

      {/* submenu */}
      <nav className="mt-3 md:mt-4">
        <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
          {menu.items.map((item) => (
            <li key={item.path} className="shrink-0 md:shrink">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
