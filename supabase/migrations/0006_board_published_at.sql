-- =============================================================================
-- 게시판 3종(activities/month_activities/benefits) 공개 모델 전환:
--   published(boolean) → published_at(nullable timestamptz).
--   공개 기준을 "published_at 이 현재 시각을 지난 경우만 노출(null=비공개)" 로 변경.
--   press 는 기존 published(boolean) 유지 — 이 마이그레이션 대상 아님.
--
--   기존 데이터 이관: published=true 였던 글은 created_at 을 published_at 으로 옮겨
--   과거 시각이 되도록 하여 공개 상태를 그대로 유지한다. published=false 는 null(비공개).
--   (policy → month_activities 테이블 개명은 이미 완료된 것으로 가정한다.)
--   (신규 설치는 0001_init.sql 에 반영됨. 기존 DB 는 이 파일을 1회 실행.)
-- =============================================================================

-- ── 활동내역 ────────────────────────────────────────────────────────────────
drop policy if exists activities_public_read on public.activities;
alter table public.activities add column if not exists published_at timestamptz;
update public.activities set published_at = created_at
  where published_at is null and published = true;
alter table public.activities drop column if exists published;
create index if not exists idx_activities_published on public.activities (published_at desc);
create policy activities_public_read on public.activities for select
  using (public.is_admin() or (published_at is not null and published_at <= now()));

-- ── 월별활동보고 ────────────────────────────────────────────────────────────
drop policy if exists month_activities_public_read on public.month_activities;
drop policy if exists policy_public_read on public.month_activities;   -- 구 policy 정책명 잔재 정리
alter table public.month_activities add column if not exists published_at timestamptz;
update public.month_activities set published_at = created_at
  where published_at is null and published = true;
alter table public.month_activities drop column if exists published;
create index if not exists idx_month_activities_published on public.month_activities (published_at desc);
create policy month_activities_public_read on public.month_activities for select
  using (public.is_admin() or (published_at is not null and published_at <= now()));

-- ── 조합원 혜택 ─────────────────────────────────────────────────────────────
drop policy if exists benefits_public_read on public.benefits;
alter table public.benefits add column if not exists published_at timestamptz;
update public.benefits set published_at = created_at
  where published_at is null and published = true;
alter table public.benefits drop column if exists published;
create index if not exists idx_benefits_published on public.benefits (published_at desc);
create policy benefits_public_read on public.benefits for select
  using (public.is_admin() or (published_at is not null and published_at <= now()));
