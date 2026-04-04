-- 1. Create the 'programs' bucket if it doesn't exist and make it public
insert into storage.buckets (id, name, public) 
values ('programs', 'programs', true)
on conflict (id) do update set public = true;

-- 2. Enable RLS on storage.objects (if not already enabled)
alter table storage.objects enable row level security;

-- 3. Policy to allow anyone to read/download the images
create policy "Allow public viewing of programs images" 
on storage.objects for select 
using ( bucket_id = 'programs' );

-- 4. Policy to allow authenticated users to upload (insert) images
create policy "Allow authenticated users to upload programs images" 
on storage.objects for insert 
with check ( bucket_id = 'programs' and auth.role() = 'authenticated' );

-- 5. Policy to allow authenticated users to update images (needed for replacements)
create policy "Allow authenticated users to update programs images" 
on storage.objects for update 
using ( bucket_id = 'programs' and auth.role() = 'authenticated' );

-- 6. Policy to allow authenticated users to delete images
create policy "Allow authenticated users to delete programs images" 
on storage.objects for delete 
using ( bucket_id = 'programs' and auth.role() = 'authenticated' );
