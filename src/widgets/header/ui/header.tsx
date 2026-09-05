import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ExternalLinkIcon, Menu } from "lucide-react";
import { navMenus } from "@/shared/configs/nav";
import { routes } from "@/shared/configs/routes";
import { cn } from "@/shared/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/shared/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Logo } from "@/shared/ui/logo";
import { CONSTANTS } from "@/shared/configs/constants";

export const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={routes.ROOT}
          className="text-lg font-bold tracking-tight sm:text-xl"
        >
          <Logo className="w-50 md:w-65" />
        </Link>

        {/* Desktop navigation */}
        <NavigationMenu className="hidden md:flex" viewport={false}>
          <NavigationMenuList>
            {navMenus.map((menu) =>
              menu.items ? (
                <NavigationMenuItem key={menu.label}>
                  <NavigationMenuTrigger>
                    <Link
                      to={menu.items[0].path}
                      target={menu.items[0].external ? "_blank" : undefined}
                    >
                      {menu.label}
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-42 gap-1 p-0">
                      {menu.items.map((item) => {
                        const isSelected = item.path == location.pathname;

                        return (
                          <li key={item.path}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.path}
                                target={item.external ? "_blank" : undefined}
                                className={cn(
                                  "block rounded-md px-2 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary",
                                  isSelected
                                    ? "text-primary font-semibold"
                                    : "",
                                )}
                              >
                                {item.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={menu.label}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to={menu.path!}>{menu.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}

            <NavigationMenuItem key={CONSTANTS.PORTAL_LINK}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={CONSTANTS.PORTAL_LINK} target="_blank">
                  <div className="flex items-center gap-2">
                    {CONSTANTS.PORTAL_LABEL}
                    <ExternalLinkIcon />
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile navigation */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo className="w-50" />
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto px-4 pb-6">
                <Accordion type="multiple">
                  {navMenus.map((menu) =>
                    menu.items ? (
                      <AccordionItem key={menu.label} value={menu.label}>
                        <AccordionTrigger className="text-base font-medium">
                          {menu.label}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="flex flex-col gap-1 pl-2">
                            {menu.items.map((item) => {
                              const isSelected = item.path == location.pathname;
                              return (
                                <li key={item.path}>
                                  <SheetClose asChild>
                                    <NavLink
                                      to={item.path}
                                      target={
                                        item.external ? "_blank" : undefined
                                      }
                                      className={cn(
                                        "block rounded-md px-3 py-2 text-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          isSelected
                                            ? "text-primary font-semibold"
                                            : "text-muted-foreground",
                                        )}
                                      >
                                        {item.label}
                                      </span>
                                    </NavLink>
                                  </SheetClose>
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <SheetClose asChild key={menu.label}>
                        <NavLink
                          to={menu.path!}
                          className={({ isActive }) =>
                            cn(
                              "flex py-4 text-base font-medium transition-colors hover:text-foreground",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )
                          }
                        >
                          {menu.label}
                        </NavLink>
                      </SheetClose>
                    ),
                  )}

                  <SheetClose asChild key={`mobile-${CONSTANTS.PORTAL_LABEL}`}>
                    <NavLink
                      to={CONSTANTS.PORTAL_LINK}
                      target="_blank"
                      className={({ isActive }) =>
                        cn(
                          "flex py-4 font-medium transition-colors hover:text-foreground",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex py-4 text-base font-medium transition-colors hover:text-foreground",
                            "text-foreground",
                          )}
                        >
                          {CONSTANTS.PORTAL_LABEL}
                        </span>
                        <ExternalLinkIcon className="text-gray-600 size-4" />
                      </div>
                    </NavLink>
                  </SheetClose>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
