-- 조회수 증가 RPC 보강: 공개된 글만 카운트 (비공개/예약 글 조작 방지)
--   - press: published = true
--   - activities / month_activities / benefits: published_at <= now()
create or replace function public.increment_views(table_name text, row_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if table_name = 'press' then
    update public.press set views = views + 1
     where id = row_id and published = true;
  elsif table_name in ('activities', 'month_activities', 'benefits') then
    execute format(
      'update public.%I set views = views + 1 where id = $1 and published_at <= now()',
      table_name
    ) using row_id;
  else
    raise exception 'invalid table';
  end if;
end;
$$;

grant execute on function public.increment_views(text, bigint) to anon, authenticated;
