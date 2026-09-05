import { BoardSubMenu } from "@/widgets/board-submenu";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const BoardLayout = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex">
        <BoardSubMenu />

        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
