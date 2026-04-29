-- 1) Roles enum + user_roles table (separate table per security best practices)
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function so RLS policies don't recurse
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Only admins can read the roles table
create policy "Admins can view roles"
on public.user_roles
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- 2) contact_submissions table
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  organization text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Anyone (including anon) can submit
create policy "Anyone can submit contact messages"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

-- Only admins can read/update/delete
create policy "Admins can view all submissions"
on public.contact_submissions
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update submissions"
on public.contact_submissions
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete submissions"
on public.contact_submissions
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Index for ordering by newest
create index contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
