-- Execute this migration on the same Supabase project used by Vercel.
alter table public.site_profile add column if not exists avatar_url text not null default '';
alter table public.site_profile add column if not exists hero_kicker text not null default 'Engenheiro de software · Rio de Janeiro';
alter table public.site_profile add column if not exists hero_title text not null default 'Ideias fortes merecem tecnologia.';
alter table public.site_profile add column if not exists hero_lede text not null default 'Eu construo produtos digitais que conectam estratégia, engenharia e pessoas.';
alter table public.site_profile add column if not exists about_title text not null default 'Engenharia com visão de produto.';
alter table public.site_profile add column if not exists about_text_one text not null default '';
alter table public.site_profile add column if not exists about_text_two text not null default '';
alter table public.site_profile add column if not exists process_title text not null default 'Clareza antes do código.';
alter table public.site_profile add column if not exists process_text text not null default 'Um processo simples para transformar problemas complexos em produtos que funcionam.';
alter table public.site_profile add column if not exists contact_title text not null default 'Tem uma ideia? Vamos tirar do papel.';
alter table public.site_profile add column if not exists contact_text text not null default 'Conte o que você está construindo e vamos pensar juntos nos próximos passos.';

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Ferramenta',
  icon text not null default '✦',
  sort_order integer not null default 10,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.tools enable row level security;
grant select on public.tools to anon, authenticated;
grant insert, update, delete on public.tools to authenticated;

drop policy if exists "published tools are public" on public.tools;
drop policy if exists "admins can manage tools" on public.tools;
create policy "published tools are public" on public.tools for select to anon, authenticated using (is_published = true);
create policy "admins can manage tools" on public.tools for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into public.site_profile (id, full_name, role, contact_email, github_url, hero_kicker, hero_title, hero_lede, about_title, about_text_one, about_text_two, process_title, process_text, contact_title, contact_text)
values ('main', 'Eliseu Rodrigues Guimarães Costa', 'Engenheiro de software', 'eliseu.guimaraes@rizzonet.com.br', 'https://github.com/enpiricos', 'Engenheiro de software · Rio de Janeiro', 'Ideias fortes merecem tecnologia.', 'Eu construo produtos digitais que conectam estratégia, engenharia e pessoas.', 'Engenharia com visão de produto.', 'Sou Eliseu, engenheiro de software. Trabalho na interseção entre tecnologia, produto e pessoas para transformar problemas complexos em experiências simples.', 'Do primeiro esboço ao deploy, penso em sistemas que fazem sentido para quem usa e para quem mantém. Código é ferramenta; impacto é o objetivo.', 'Clareza antes do código.', 'Um processo simples para transformar problemas complexos em produtos que funcionam.', 'Tem uma ideia? Vamos tirar do papel.', 'Conte o que você está construindo e vamos pensar juntos nos próximos passos.')
on conflict (id) do update set hero_kicker = excluded.hero_kicker, hero_title = excluded.hero_title, hero_lede = excluded.hero_lede, about_title = excluded.about_title, process_title = excluded.process_title, contact_title = excluded.contact_title;

insert into storage.buckets (id, name, public) values ('profile-assets', 'profile-assets', true) on conflict (id) do update set public = true;
drop policy if exists "public can read profile assets" on storage.objects;
drop policy if exists "admins can upload profile assets" on storage.objects;
drop policy if exists "admins can update profile assets" on storage.objects;
drop policy if exists "admins can delete profile assets" on storage.objects;
create policy "public can read profile assets" on storage.objects for select to anon, authenticated using (bucket_id = 'profile-assets');
create policy "admins can upload profile assets" on storage.objects for insert to authenticated with check (bucket_id = 'profile-assets' and exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can update profile assets" on storage.objects for update to authenticated using (bucket_id = 'profile-assets' and exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins can delete profile assets" on storage.objects for delete to authenticated using (bucket_id = 'profile-assets' and exists (select 1 from public.admin_users where user_id = auth.uid()));
