-- =============================================================================
-- terms 를 "적용날짜별 버전 목록" 으로 전환:
--   slug 유니크 제거(같은 slug 로 여러 버전 허용) + 조회 인덱스 추가.
--   (신규 설치는 0001_init.sql 에 반영됨. 기존 DB 는 이 파일을 1회 실행.)
-- 선행: 0003_terms_restructure.sql (id PK 전환) 이 먼저 적용되어 있어야 함.
-- =============================================================================

-- slug 유니크/PK 흔적 제거 (여러 버전 허용)
alter table public.terms drop constraint if exists terms_slug_key;

-- slug 별 최신 적용날짜 조회용 인덱스
create index if not exists idx_terms_slug_effective
  on public.terms (slug, effective_date desc);
