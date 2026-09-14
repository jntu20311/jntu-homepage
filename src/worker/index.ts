import { Hono } from "hono";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Bindings = Env & {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: { userId: string } }>();

const admin = (env: Bindings): SupabaseClient =>
  createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

/* --------------------------------------------------------------------------
 * 관리자 계정 관리 (service_role 필요). 호출자는 관리자 JWT 를 Bearer 로 전달.
 * -------------------------------------------------------------------------- */

// 인증 미들웨어: Bearer 토큰 검증 + admins 소속 확인
app.use("/api/admin/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return c.json({ error: "인증이 필요합니다." }, 401);

  const sb = admin(c.env);
  const { data: userData, error } = await sb.auth.getUser(token);
  if (error || !userData.user) {
    return c.json({ error: "유효하지 않은 토큰입니다." }, 401);
  }

  const { data: adminRow } = await sb
    .from("admins")
    .select("id")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (!adminRow) return c.json({ error: "관리자 권한이 없습니다." }, 403);

  c.set("userId", userData.user.id);
  await next();
});

// 관리자 목록
app.get("/api/admin/users", async (c) => {
  const sb = admin(c.env);
  const { data, error } = await sb
    .from("admins")
    .select("id, email, name, is_protected, created_at")
    .order("created_at", { ascending: true });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ users: data });
});

// 관리자 생성
app.post("/api/admin/users", async (c) => {
  const { email, password, name } = await c.req.json<{
    email: string;
    password: string;
    name?: string;
  }>();

  if (!email || !password) {
    return c.json({ error: "이메일과 비밀번호는 필수입니다." }, 400);
  }

  const sb = admin(c.env);
  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr || !created.user) {
    return c.json({ error: createErr?.message ?? "계정 생성 실패" }, 400);
  }

  const { error: insertErr } = await sb.from("admins").insert({
    id: created.user.id,
    email,
    name: name ?? "",
    is_protected: false,
  });
  if (insertErr) {
    // 롤백: 방금 만든 auth 사용자 제거
    await sb.auth.admin.deleteUser(created.user.id);
    return c.json({ error: insertErr.message }, 400);
  }

  return c.json({ id: created.user.id, email, name: name ?? "" });
});

// 관리자 삭제 (기본 계정은 거부)
app.delete("/api/admin/users/:id", async (c) => {
  const id = c.req.param("id");
  const sb = admin(c.env);

  const { data: target } = await sb
    .from("admins")
    .select("id, is_protected")
    .eq("id", id)
    .maybeSingle();
  if (!target) return c.json({ error: "존재하지 않는 계정입니다." }, 404);
  if (target.is_protected) {
    return c.json({ error: "기본 관리자 계정은 삭제할 수 없습니다." }, 400);
  }

  const { error: delErr } = await sb.auth.admin.deleteUser(id); // admins 행은 FK cascade 로 제거
  if (delErr) return c.json({ error: delErr.message }, 400);

  return c.json({ id });
});

/* --------------------------------------------------------------------------
 * 스케줄: tmp 고아 파일 스윕 (24h 이상 미저장 업로드)
 *   - board  : tmp/<postType>/<file>  (본문 이미지·대표 이미지·첨부)
 *   - banners: tmp/<file>             (배너 이미지)
 * -------------------------------------------------------------------------- */
const TMP_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** 지정 prefix 아래 파일 중 24h 초과분 경로 수집 */
const collectAgedFiles = async (
  sb: ReturnType<typeof admin>,
  bucket: string,
  prefix: string,
  now: number,
): Promise<string[]> => {
  const out: string[] = [];
  const { data: files } = await sb.storage.from(bucket).list(prefix, {
    limit: 1000,
  });
  for (const f of files ?? []) {
    if (!f.id) continue; // 하위 디렉터리는 스킵(파일만)
    const created = f.created_at ? new Date(f.created_at).getTime() : now;
    if (now - created > TMP_MAX_AGE_MS) out.push(`${prefix}/${f.name}`);
  }
  return out;
};

const sweepTmpOrphans = async (env: Bindings) => {
  const sb = admin(env);
  const now = Date.now();

  // board: tmp/<postType>/ 구조 → 2단계 순회
  const boardRemove: string[] = [];
  const { data: typeDirs } = await sb.storage.from("board").list("tmp");
  for (const dir of typeDirs ?? []) {
    if (dir.id) continue; // 파일이면 스킵(디렉터리만 순회)
    boardRemove.push(
      ...(await collectAgedFiles(sb, "board", `tmp/${dir.name}`, now)),
    );
  }
  if (boardRemove.length > 0) {
    await sb.storage.from("board").remove(boardRemove);
  }

  // banners: tmp/ 평면 구조
  const bannerRemove = await collectAgedFiles(sb, "banners", "tmp", now);
  if (bannerRemove.length > 0) {
    await sb.storage.from("banners").remove(bannerRemove);
  }
};

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledController, env: Bindings) {
    await sweepTmpOrphans(env);
  },
};
