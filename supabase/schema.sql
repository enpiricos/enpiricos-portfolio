-- Execute este arquivo no SQL Editor do projeto Supabase.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  eyebrow text not null default '',
  description text not null default '',
  stack text not null default '',
  href text not null default '',
  tone text not null default 'blue' check (tone in ('blue', 'black', 'white')),
  sort_order integer not null default 10,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_profile (
  id text primary key default 'main',
  full_name text not null default '',
  role text not null default '',
  bio text not null default '',
  contact_email text not null default '',
  phone text not null default '',
  address text not null default '',
  cnpj text not null default '',
  github_url text not null default '',
  linkedin_url text not null default '',
  instagram_url text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.site_profile enable row level security;

create policy "admins can read their authorization" on public.admin_users for select to authenticated using (user_id = auth.uid());
create policy "published projects are public" on public.projects for select to anon, authenticated using (is_published = true);
create policy "admins can manage projects" on public.projects for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "public can read profile" on public.site_profile for select to anon, authenticated using (id = 'main');
create policy "admins can manage profile" on public.site_profile for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into public.site_profile (id, full_name, role, contact_email, github_url)
values ('main', 'Eliseu Rodrigues Guimarães Costa', 'Engenheiro de software', 'eliseu.guimaraes@rizzonet.com.br', 'https://github.com/enpiricos')
on conflict (id) do nothing;

insert into public.projects (title, eyebrow, description, stack, href, tone, sort_order)
values
('ItaZoo', 'Patrimônio & ciência', 'Portal científico e repositório paleontológico 3D da Bacia de São José de Itaboraí.', 'React · TanStack Start · Three.js', 'https://itazoo.enpiricos.com.br', 'blue', 1),
('Monetos', 'Produto financeiro', 'Uma experiência digital para transformar dados financeiros em decisões melhores.', 'React · TypeScript · Supabase', 'https://monetos.enpiricos.com.br', 'black', 2)
on conflict do nothing;

-- Depois de criar o usuário no Authentication > Users, autorize-o com:
-- insert into public.admin_users (user_id, email) select id, email from auth.users where email = 'seu-email@dominio.com';
