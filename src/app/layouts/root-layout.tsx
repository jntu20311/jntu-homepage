import { Suspense } from "react";
import { Outlet } from "react-router-dom";
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
    </div>
  );
};
