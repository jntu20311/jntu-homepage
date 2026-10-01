import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer, Header, QuickMenu } from "@/widgets";

export const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <QuickMenu />
      {/* 페이지/쿼리 변경 시 스크롤 상단 이동, 뒤로가기 시 위치 복원 */}
      <ScrollRestoration />
    </div>
  );
};
