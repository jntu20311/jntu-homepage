import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Button } from "@/shared/ui/button";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login(
      { email, password },
      {
        onSuccess: (data) => {
          if (!data.success) {
            setError(data.error?.message ?? "로그인에 실패했습니다.");
          }
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border bg-background p-6 shadow-sm"
      >
        <h1 className="text-lg font-bold">JNTU 관리자 로그인</h1>

        <div>
          <label className="mb-1 block text-sm font-medium">이메일</label>
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">비밀번호</label>
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
};
