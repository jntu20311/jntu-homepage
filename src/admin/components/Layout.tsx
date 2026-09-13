import { NavLink, Outlet } from "react-router-dom";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { resources } from "../config";

const navGroups: { title: string; names: string[] }[] = [
  { title: "홈 화면", names: ["banners", "home_links"] },
  {
    title: "게시판",
    names: ["press", "activities", "month_activities", "benefits"],
  },
  { title: "사이트", names: ["terms", "admins"] },
];

export const Layout = () => {
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity<{ name?: string }>();

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="flex w-56 shrink-0 flex-col border-r bg-background">
        <div className="border-b px-4 py-4">
          <p className="text-sm font-bold">전남광주교사노동조합 홈페이지</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {identity?.name ? `사용자명: ${identity.name}` : "-"}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-3">
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                {group.title}
              </p>
              {group.names.map((name) => {
                const res = resources.find((r) => r.name === name);
                if (!res) return null;
                return (
                  <NavLink
                    key={name}
                    to={`/admin/${name}`}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-md px-2 py-1.5 text-sm",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent",
                      )
                    }
                  >
                    {res.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t p-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => logout()}
          >
            로그아웃
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
