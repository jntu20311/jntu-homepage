import {
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import { routes } from "@/shared/configs/routes";
import { Button } from "@/shared/ui/button";

export const ErrorPage = () => {
  const error = useRouteError();

  let status: number | undefined;
  let title = "문제가 발생했습니다";
  let message =
    "일시적인 오류로 페이지를 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = `${error.status} ${error.statusText}`;
    if (typeof error.data === "string" && error.data) message = error.data;
  } else if (error instanceof Error && import.meta.env.DEV) {
    // 개발 환경에서만 실제 에러 메시지 노출 (운영에서는 내부 정보 숨김)
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      {status ? (
        <p className="text-7xl font-bold text-primary sm:text-8xl">{status}</p>
      ) : null}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-md text-muted-foreground">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          새로고침
        </Button>
        <Button asChild>
          <Link to={routes.ROOT}>홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
};
