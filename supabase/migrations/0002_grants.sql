-- =============================================================================
-- 0001 적용 후 테이블 GRANT 가 누락되어 403(permission denied for table) 이
-- 발생하는 경우 실행. (신규 설치는 0001_init.sql 에 이미 포함됨)
--   RLS 는 "행" 접근을, GRANT 는 "테이블" 접근을 통제한다. 둘 다 필요.
-- Supabase 대시보드 → SQL Editor 에서 실행.
-- =============================================================================
grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

grant select on all tables in schema public to anon;

alter default privileges in schema public
  grant all on tables to service_role;
alter default privileges in schema public
  grant all on sequences to service_role;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;
