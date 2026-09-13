-- =============================================================================
-- jntu-homepage : 관리자/공개 사이트용 초기 스키마
-- 대상: 홈 배너, 홈 바로가기, 게시판 4종(보도자료/활동내역/정책/조합원혜택),
--       약관 2종, 관리자 계정
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 공통: updated_at 자동 갱신 트리거 함수
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 관리자 테이블 + is_admin() 헬퍼
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  name          text not null default '',
  is_protected  boolean not null default false,   -- 삭제 불가능한 기본 관리자
  created_at    timestamptz not null default now()
);

-- 현재 로그인 사용자가 관리자인지 확인 (RLS 정책에서 사용)
-- SECURITY DEFINER 로 admins 를 조회하므로 admins 자체 RLS 재귀를 피한다.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins a where a.id = auth.uid()
  );
$$;

-- 기본 관리자 삭제 방지 (애플리케이션 계층과 이중 방어)
create or replace function public.prevent_protected_admin_delete()
returns trigger
language plpgsql
as $$
begin
  if old.is_protected then
    raise exception '기본 관리자 계정은 삭제할 수 없습니다.';
  end if;
  return old;
end;
$$;

create trigger trg_prevent_protected_admin_delete
  before delete on public.admins
  for each row execute function public.prevent_protected_admin_delete();

-- ---------------------------------------------------------------------------
-- 홈 배너 (이미지 슬라이더)
-- ---------------------------------------------------------------------------
create table if not exists public.banners (
  id          bigint generated always as identity primary key,
  image_url   text not null,
  alt         text not null default '',
  link        text,                 -- 이동 링크 (없을 수 있음)
  external    boolean not null default false,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 홈 바로가기 링크
-- ---------------------------------------------------------------------------
create table if not exists public.home_links (
  id          bigint generated always as identity primary key,
  label       text not null,
  link        text not null,
  external    boolean not null default false,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 게시판 4종 (개별 테이블)
--   press(보도자료)만 type/press_date/attachment 컬럼 추가
-- ---------------------------------------------------------------------------
create table if not exists public.press (
  id               bigint generated always as identity primary key,
  title            text not null,
  content          text not null default '',       -- CKEditor HTML
  author           text not null default '',        -- 작성자 표시용 이름 스냅샷
  author_id        uuid,                             -- 작성 관리자 admins.id (추적용, FK 제약 없음)
  views            integer not null default 0,
  image_url        text,
  published        boolean not null default true,
  type             text not null default '전남광주'
                     check (type in ('연맹', '전남광주')),
  press_date       date not null default current_date,
  attachment_name  text,
  attachment_url   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.activities (
  id          bigint generated always as identity primary key,
  title       text not null,
  content     text not null default '',
  author      text not null default '',        -- 작성자 표시용 이름 스냅샷
  author_id   uuid,                             -- 작성 관리자 admins.id (추적용, FK 제약 없음)
  views       integer not null default 0,
  image_url   text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.month_activities (
  id          bigint generated always as identity primary key,
  title       text not null,
  content     text not null default '',
  author      text not null default '',        -- 작성자 표시용 이름 스냅샷
  author_id   uuid,                             -- 작성 관리자 admins.id (추적용, FK 제약 없음)
  views       integer not null default 0,
  image_url   text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.benefits (
  id          bigint generated always as identity primary key,
  title       text not null,
  content     text not null default '',
  author      text not null default '',        -- 작성자 표시용 이름 스냅샷
  author_id   uuid,                             -- 작성 관리자 admins.id (추적용, FK 제약 없음)
  views       integer not null default 0,
  image_url   text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- updated_at 트리거 부착
create trigger trg_press_updated       before update on public.press      for each row execute function public.set_updated_at();
create trigger trg_activities_updated  before update on public.activities for each row execute function public.set_updated_at();
create trigger trg_month_activities_updated       before update on public.month_activities     for each row execute function public.set_updated_at();
create trigger trg_benefits_updated    before update on public.benefits   for each row execute function public.set_updated_at();

-- 목록 정렬용 인덱스
create index if not exists idx_press_created      on public.press      (created_at desc);
create index if not exists idx_press_date         on public.press      (press_date desc);
create index if not exists idx_activities_created on public.activities (created_at desc);
create index if not exists idx_month_activities_created     on public.month_activities     (created_at desc);
create index if not exists idx_benefits_created   on public.benefits   (created_at desc);

-- 작성 관리자(author_id) 별 조회/필터용 인덱스
create index if not exists idx_press_author      on public.press      (author_id);
create index if not exists idx_activities_author on public.activities (author_id);
create index if not exists idx_month_activities_author     on public.month_activities     (author_id);
create index if not exists idx_benefits_author   on public.benefits   (author_id);

-- ---------------------------------------------------------------------------
-- 약관 (이용약관 / 개인정보취급방침)
-- ---------------------------------------------------------------------------
-- terms: slug(terms|privacy) 별로 적용날짜(effective_date) 버전을 여러 개 보유
create table if not exists public.terms (
  id              bigint generated always as identity primary key,
  slug            text not null check (slug in ('terms', 'privacy')),
  title           text not null,
  content         text not null default '',         -- Markdown
  effective_date  date,                              -- 적용(시행)날짜
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_terms_slug_effective
  on public.terms (slug, effective_date desc);

create trigger trg_terms_updated before update on public.terms for each row execute function public.set_updated_at();

-- 약관 기본 행 시드 (본문은 관리자에서 입력) — 각 slug 최소 1건
insert into public.terms (slug, title, content, effective_date)
select 'terms', '이용약관', '', current_date
where not exists (select 1 from public.terms where slug = 'terms');

insert into public.terms (slug, title, content, effective_date)
select 'privacy', '개인정보처리방침', '', current_date
where not exists (select 1 from public.terms where slug = 'privacy');

-- ---------------------------------------------------------------------------
-- 조회수 증가 RPC (공개 사이트 상세 진입 시)
-- ---------------------------------------------------------------------------
create or replace function public.increment_views(table_name text, row_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if table_name not in ('press', 'activities', 'month_activities', 'benefits') then
    raise exception 'invalid table';
  end if;
  execute format('update public.%I set views = views + 1 where id = $1', table_name)
    using row_id;
end;
$$;

-- =============================================================================
-- RLS 정책
-- =============================================================================
alter table public.admins      enable row level security;
alter table public.banners     enable row level security;
alter table public.home_links  enable row level security;
alter table public.press       enable row level security;
alter table public.activities  enable row level security;
alter table public.month_activities      enable row level security;
alter table public.benefits    enable row level security;
alter table public.terms       enable row level security;

-- admins: 관리자만 조회/수정 (생성/삭제는 서버 service_role 로 처리)
create policy admins_select on public.admins for select using (public.is_admin());
create policy admins_write  on public.admins for all
  using (public.is_admin()) with check (public.is_admin());

-- 공개 읽기 + 관리자 쓰기 정책을 각 공개 테이블에 적용
-- (banners / home_links : active = true 만 공개 노출)
create policy banners_public_read on public.banners for select using (active = true or public.is_admin());
create policy banners_admin_write on public.banners for all using (public.is_admin()) with check (public.is_admin());

create policy home_links_public_read on public.home_links for select using (active = true or public.is_admin());
create policy home_links_admin_write on public.home_links for all using (public.is_admin()) with check (public.is_admin());

-- 게시판: published = true 만 공개, 관리자는 전체
create policy press_public_read on public.press for select using (published = true or public.is_admin());
create policy press_admin_write on public.press for all using (public.is_admin()) with check (public.is_admin());

create policy activities_public_read on public.activities for select using (published = true or public.is_admin());
create policy activities_admin_write on public.activities for all using (public.is_admin()) with check (public.is_admin());

create policy policy_public_read on public.policy for select using (published = true or public.is_admin());
create policy policy_admin_write on public.policy for all using (public.is_admin()) with check (public.is_admin());

create policy benefits_public_read on public.benefits for select using (published = true or public.is_admin());
create policy benefits_admin_write on public.benefits for all using (public.is_admin()) with check (public.is_admin());

-- 약관: 전체 공개 읽기, 관리자 수정
create policy terms_public_read on public.terms for select using (true);
create policy terms_admin_write on public.terms for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- 역할(role) 테이블 권한 (GRANT)
--   RLS 는 "행" 수준 접근을 통제하지만, 그 이전에 역할이 테이블에 접근할 수 있는
--   "테이블" 수준 GRANT 가 있어야 한다. (없으면 permission denied → HTTP 403)
--   실제 노출 여부는 위의 RLS 정책이 최종 결정한다.
-- =============================================================================
grant usage on schema public to anon, authenticated, service_role;

-- service_role: 전체 (Worker 에서 사용, RLS 우회)
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- authenticated(로그인한 관리자): 읽기/쓰기 — 실제 허용은 RLS 가 통제
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- anon(공개 사이트): 읽기만 — 실제 노출 행은 RLS(public_read) 가 통제
grant select on all tables in schema public to anon;

-- 이후 생성될 테이블/시퀀스에도 자동 적용 (기본 권한)
alter default privileges in schema public
  grant all on tables to service_role;
alter default privileges in schema public
  grant all on sequences to service_role;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;

-- =============================================================================
-- Storage 버킷 + 정책 (공개 read, 관리자 write)
-- =============================================================================
insert into storage.buckets (id, name, public) values ('banners', 'banners', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('board', 'board', true)
  on conflict (id) do nothing;

create policy "banners public read"  on storage.objects for select using (bucket_id = 'banners');
create policy "banners admin write"  on storage.objects for insert with check (bucket_id = 'banners' and public.is_admin());
create policy "banners admin update" on storage.objects for update using (bucket_id = 'banners' and public.is_admin());
create policy "banners admin delete" on storage.objects for delete using (bucket_id = 'banners' and public.is_admin());

create policy "board public read"  on storage.objects for select using (bucket_id = 'board');
create policy "board admin write"  on storage.objects for insert with check (bucket_id = 'board' and public.is_admin());
create policy "board admin update" on storage.objects for update using (bucket_id = 'board' and public.is_admin());
create policy "board admin delete" on storage.objects for delete using (bucket_id = 'board' and public.is_admin());
