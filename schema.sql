-- ==============================================================================
-- Saman Premium - Base Database Schema & Row Level Security (RLS)
-- ==============================================================================
-- Idempotent script: Safe to run repeatedly in Supabase SQL Editor.

-- 1. Create Profiles Table (if not exists)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('her', 'him')),
  name text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. RLS Policies (Idempotent: Drop if exists before re-creating)

-- Policy 1: Allow authenticated couple users to read profiles
drop policy if exists "Authenticated users can view profiles" on public.profiles;
create policy "Authenticated users can view profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Policy 2: Allow users to insert their own profile
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Policy 3: Allow users to update only their own profile
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. Function & Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text;
  user_name text;
begin
  -- Retrieve role from user metadata, defaulting to 'her' or 'him' if specified
  user_role := coalesce(new.raw_user_meta_data->>'role', 'her');
  user_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  insert into public.profiles (id, email, role, name)
  values (
    new.id,
    lower(new.email),
    user_role,
    user_name
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = coalesce(excluded.name, profiles.name),
    role = coalesce(excluded.role, profiles.role),
    updated_at = now();

  return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Updated timestamp trigger
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on public.profiles;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();
