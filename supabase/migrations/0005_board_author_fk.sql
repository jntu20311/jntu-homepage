-- =============================================================================
-- 게시판 4종(press/activities/month_activities/benefits) 에 작성 관리자 식별자 추가.
--   author_id uuid : 어느 admins 계정이 작성했는지 추적하기 위한 용도.
--   권한 제어(작성자 전용 수정/삭제)에 쓰지 않고, admins 삭제 시 링크를 유지할
--   필요도 없어 FK 제약은 두지 않는다. 공개 페이지 표시는 기존 author(text)
--   이름 스냅샷이 담당한다 (admins 는 RLS 로 익명 조회 불가).
--   (신규 설치는 0001_init.sql 에 반영됨. 기존 DB 는 이 파일을 1회 실행.)
-- =============================================================================

alter table public.press      add column if not exists author_id uuid;
alter table public.activities  add column if not exists author_id uuid;
alter table public.month_activities      add column if not exists author_id uuid;
alter table public.benefits    add column if not exists author_id uuid;

-- 작성 관리자(author_id) 별 조회/필터용 인덱스
create index if not exists idx_press_author      on public.press      (author_id);
create index if not exists idx_activities_author on public.activities (author_id);
create index if not exists idx_policy_author     on public.month_activities     (author_id);
create index if not exists idx_benefits_author   on public.benefits   (author_id);
