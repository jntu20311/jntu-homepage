-- =============================================================================
-- terms 구조 변경: slug(PK) → id(PK) + slug(unique) + effective_date + created_at
--   (신규 설치는 0001_init.sql 에 이미 반영됨. 기존 DB 는 이 파일을 1회 실행.)
-- Supabase 대시보드 → SQL Editor 에서 실행.
-- =============================================================================

-- 1) 새 컬럼 추가
alter table public.terms add column if not exists effective_date date;
alter table public.terms add column if not exists created_at timestamptz not null default now();
alter table public.terms add column if not exists id bigint generated always as identity;

-- 2) 기본키를 slug → id 로 교체
alter table public.terms drop constraint if exists terms_pkey;
alter table public.terms add primary key (id);

-- 3) slug 는 유니크 제약으로 유지 (기존 PK 였으므로 값은 유일함)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'terms_slug_key'
  ) then
    alter table public.terms add constraint terms_slug_key unique (slug);
  end if;
end $$;

-- 개인정보취급방침 → 개인정보처리방침 표기 정리(선택)
update public.terms set title = '개인정보처리방침'
  where slug = 'privacy' and title = '개인정보취급방침';
