import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { navItems } from "@/shared/configs/nav";
import { routes } from "@/shared/configs/routes";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={routes.ROOT}
          className="text-lg font-bold tracking-tight sm:text-xl"
        >
          JNTU
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === routes.ROOT}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">JNTU</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === routes.ROOT}
                      className={({ isActive }) =>
                        cn(
                          "rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground",
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
