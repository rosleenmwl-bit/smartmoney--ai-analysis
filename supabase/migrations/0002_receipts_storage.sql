-- Receipt snapshots are private application data. The app stores only the path
-- in public.receipts and uploads the image to this bucket before confirmation.
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do update set public = false;

drop policy if exists "receipts_storage_v1_read" on storage.objects;
create policy "receipts_storage_v1_read"
on storage.objects for select
using (bucket_id = 'receipts');

drop policy if exists "receipts_storage_v1_write" on storage.objects;
create policy "receipts_storage_v1_write"
on storage.objects for insert
with check (bucket_id = 'receipts');

drop policy if exists "receipts_storage_v1_update" on storage.objects;
create policy "receipts_storage_v1_update"
on storage.objects for update
using (bucket_id = 'receipts')
with check (bucket_id = 'receipts');

drop policy if exists "receipts_storage_v1_delete" on storage.objects;
create policy "receipts_storage_v1_delete"
on storage.objects for delete
using (bucket_id = 'receipts');
