import { Link } from "react-router-dom";
import { routes } from "@/shared/configs/routes";
import { Button } from "@/shared/ui/button";

export const NotFoundPage = () => {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="text-7xl font-bold text-primary sm:text-8xl">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>
      <Button asChild>
        <Link to={routes.ROOT}>홈으로 돌아가기</Link>
      </Button>
    </section>
  );
};
