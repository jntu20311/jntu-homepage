import { BoardSubMenu } from "@/widgets/board-submenu";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const BoardLayout = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <BoardSubMenu />

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
