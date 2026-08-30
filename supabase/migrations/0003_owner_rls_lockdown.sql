-- SmartMoney owner lock-down. Run only after rosleenmwl@yahoo.com has
-- successfully signed in through the SmartMoney app.
begin;

do $$
declare
  owner_id uuid;
begin
  select id into owner_id from auth.users where lower(email) = lower('rosleenmwl@yahoo.com') limit 1;
  if owner_id is null then
    raise exception 'Owner account rosleenmwl@yahoo.com was not found in auth.users. Sign in first, then rerun.';
  end if;

  alter table public.audit_logs add column if not exists user_id uuid;
  update public.budgets set user_id = owner_id where user_id is null;
  update public.expenses set user_id = owner_id where user_id is null;
  update public.receipts set user_id = owner_id where user_id is null;
  update public.recommendations set user_id = owner_id where user_id is null;
  update public.audit_logs set user_id = owner_id where user_id is null;
end $$;

create or replace function public.assign_current_user()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists budgets_assign_current_user on public.budgets;
create trigger budgets_assign_current_user before insert on public.budgets for each row execute function public.assign_current_user();
drop trigger if exists expenses_assign_current_user on public.expenses;
create trigger expenses_assign_current_user before insert on public.expenses for each row execute function public.assign_current_user();
drop trigger if exists receipts_assign_current_user on public.receipts;
create trigger receipts_assign_current_user before insert on public.receipts for each row execute function public.assign_current_user();
drop trigger if exists recommendations_assign_current_user on public.recommendations;
create trigger recommendations_assign_current_user before insert on public.recommendations for each row execute function public.assign_current_user();
drop trigger if exists audit_logs_assign_current_user on public.audit_logs;
create trigger audit_logs_assign_current_user before insert on public.audit_logs for each row execute function public.assign_current_user();

alter table public.budgets enable row level security;
alter table public.expenses enable row level security;
alter table public.receipts enable row level security;
alter table public.recommendations enable row level security;
alter table public.audit_logs enable row level security;
alter table public.budgets force row level security;
alter table public.expenses force row level security;
alter table public.receipts force row level security;
alter table public.recommendations force row level security;
alter table public.audit_logs force row level security;

drop policy if exists budgets_v1_read on public.budgets;
drop policy if exists budgets_v1_write on public.budgets;
drop policy if exists expenses_v1_read on public.expenses;
drop policy if exists expenses_v1_write on public.expenses;
drop policy if exists receipts_v1_read on public.receipts;
drop policy if exists receipts_v1_write on public.receipts;
drop policy if exists recommendations_v1_read on public.recommendations;
drop policy if exists recommendations_v1_write on public.recommendations;
drop policy if exists audit_logs_v1_read on public.audit_logs;
drop policy if exists audit_logs_v1_write on public.audit_logs;

create policy budgets_owner_access on public.budgets for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy expenses_owner_access on public.expenses for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy receipts_owner_access on public.receipts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy recommendations_owner_access on public.recommendations for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy audit_logs_owner_access on public.audit_logs for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists categories_v1_read on public.categories;
drop policy if exists categories_v1_write on public.categories;
create policy categories_authenticated_read on public.categories for select to authenticated using (true);

drop policy if exists receipts_storage_v1_read on storage.objects;
drop policy if exists receipts_storage_v1_write on storage.objects;
drop policy if exists receipts_storage_v1_update on storage.objects;
drop policy if exists receipts_storage_v1_delete on storage.objects;
create policy receipts_storage_owner_read on storage.objects for select to authenticated using (bucket_id = 'receipts' and split_part(name, '/', 1) = auth.uid()::text);
create policy receipts_storage_owner_write on storage.objects for insert to authenticated with check (bucket_id = 'receipts' and split_part(name, '/', 1) = auth.uid()::text);
create policy receipts_storage_owner_update on storage.objects for update to authenticated using (bucket_id = 'receipts' and split_part(name, '/', 1) = auth.uid()::text) with check (bucket_id = 'receipts' and split_part(name, '/', 1) = auth.uid()::text);
create policy receipts_storage_owner_delete on storage.objects for delete to authenticated using (bucket_id = 'receipts' and split_part(name, '/', 1) = auth.uid()::text);

commit;
