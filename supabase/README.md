# Supabase 설정 가이드

관리자 페이지(`/admin`)와 공개 사이트가 Supabase(Postgres + Auth + Storage)를 사용합니다.
아래 순서대로 1회 설정하면 동작합니다.

## 1. 스키마 적용

Supabase 대시보드 → **SQL Editor** 에서 [`migrations/0001_init.sql`](./migrations/0001_init.sql) 전체를 실행합니다.
(테이블 · RLS · 트리거 · Storage 버킷(`banners`, `board`) · 약관 기본행 · 역할 GRANT 가 생성됩니다.)

> 이미 GRANT 없는 예전 스키마를 적용해 **403 permission denied** 가 난다면
> [`migrations/0002_grants.sql`](./migrations/0002_grants.sql) 를 실행하세요.

## 2. 기본 관리자 계정 생성 (삭제 불가)

1. 대시보드 → **Authentication → Users → Add user** 로 관리자 이메일/비밀번호 생성
   (Auto Confirm User 체크).
2. 생성된 사용자의 **UID** 를 복사한 뒤, SQL Editor 에서 실행 (RLS 우회됨):

   ```sql
   insert into public.admins (id, email, name, is_protected)
   values ('<복사한-UID>', '<관리자-이메일>', '최고관리자', true);
   ```

이 계정은 `is_protected = true` 라 삭제할 수 없고, 로그인 후 `/admin/admins` 에서
다른 관리자를 추가/삭제할 수 있습니다.

## 3. 환경변수

### 클라이언트 (`.env`) — 이미 존재
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...    # anon(publishable) 키
```

### Worker 시크릿 — 관리자 계정 생성/삭제에 필요 (service_role)
- 로컬: `.dev.vars` (예시는 `.dev.vars.example`)
  ```
  SUPABASE_URL=https://<project>.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=<service_role 키>   # 대시보드 → Settings → API
  ```
- 배포:
  ```bash
  wrangler secret put SUPABASE_URL
  wrangler secret put SUPABASE_SERVICE_ROLE_KEY
  ```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` 는 절대 `VITE_` 접두사로 두거나 클라이언트에 노출하지 마세요.
> Worker(`/api/admin/*`) 에서만 사용합니다.

## 4. 실행 / 확인

```bash
npm run dev
```
- 관리자: `http://localhost:5173/admin` → 기본 관리자로 로그인
- 배너/게시판/약관을 등록하면 공개 사이트(홈·알림마당·약관)에 반영됩니다.

## 관리 대상 테이블

| 테이블 | 용도 | 공개 페이지 |
|---|---|---|
| `banners` | 홈 배너 슬라이드 | 홈 |
| `home_links` | 홈 바로가기 | 홈 |
| `press` | 보도자료 | 알림마당 › 보도자료 |
| `activities` | 활동내역 | 알림마당 › 활동내역 |
| `policy` | 정책/월별활동보고 | 알림마당 › 정책 |
| `benefits` | 조합원 혜택 | 알림마당 › 조합원 혜택 |
| `terms` | 이용약관/개인정보취급방침 | 푸터 링크 |
| `admins` | 관리자 계정 | (관리자 전용) |

## 게시판 본문 이미지(CKEditor) 고아 파일 관리

- 본문 이미지는 업로드 시 `board/tmp/...` 에 저장되고, 저장 시 `board/posts/<type>/<id>/...` 로 이동됩니다.
- 본문에서 제거된 이미지·삭제된 게시글의 이미지는 저장/삭제 시 함께 제거됩니다.
- 작성 취소 등으로 남은 `board/tmp` 파일은 매일 03:00(UTC) Cron(`scheduled`)이 24시간 경과분을 정리합니다.
