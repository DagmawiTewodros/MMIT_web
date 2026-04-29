alter table public.contact_submissions replica identity full;
alter publication supabase_realtime add table public.contact_submissions;