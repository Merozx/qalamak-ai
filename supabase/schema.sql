-- Qalamak AI complete SaaS schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free','pro','agency')),
  credits integer not null default 10 check (credits >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text,
  platform text,
  dialect text,
  tone text,
  prompt_input jsonb not null default '{}'::jsonb,
  result text not null,
  source text not null default 'gemini',
  created_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'lemonsqueezy',
  provider_customer_id text,
  provider_subscription_id text unique,
  plan text not null default 'free',
  status text not null default 'active',
  raw_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.generations enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "generations_select_own" on public.generations;
create policy "generations_select_own" on public.generations for select using (auth.uid() = user_id);

drop policy if exists "credit_tx_select_own" on public.credit_transactions;
create policy "credit_tx_select_own" on public.credit_transactions for select using (auth.uid() = user_id);

drop policy if exists "subs_select_own" on public.subscriptions;
create policy "subs_select_own" on public.subscriptions for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan, credits)
  values (new.id, new.email, 'free', 10)
  on conflict (id) do nothing;
  insert into public.credit_transactions (user_id, amount, reason)
  values (new.id, 10, 'signup_bonus')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.consume_credit(p_user_id uuid)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare new_credits integer;
begin
  update public.profiles
  set credits = credits - 1, updated_at = now()
  where id = p_user_id and credits > 0
  returning credits into new_credits;

  if new_credits is null then
    return false;
  end if;

  insert into public.credit_transactions (user_id, amount, reason)
  values (p_user_id, -1, 'generation');
  return true;
end;
$$;

create or replace function public.refund_credit(p_user_id uuid)
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set credits = credits + 1, updated_at = now()
  where id = p_user_id;
  insert into public.credit_transactions (user_id, amount, reason)
  values (p_user_id, 1, 'refund_failed_generation');
  return true;
end;
$$;

create or replace function public.add_credits(p_user_id uuid, p_amount integer, p_reason text default 'manual')
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set credits = credits + p_amount, updated_at = now()
  where id = p_user_id;
  insert into public.credit_transactions (user_id, amount, reason)
  values (p_user_id, p_amount, p_reason);
  return true;
end;
$$;
