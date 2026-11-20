-- Separate the company, developer and editorial content domains.
create table if not exists public.company_profile (
  id text primary key default 'main',
  legal_name text not null default '',
  trade_name text not null default '',
  cnpj text not null default '',
  contact_email text not null default '',
  phone text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default '',
  zip_code text not null default '',
  website text not null default '',
  instagram_url text not null default '',
  linkedin_url text not null default '',
  youtube_url text not null default '',
  whatsapp_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.developer_profile (
  id text primary key default 'main',
  full_name text not null default '',
  role text not null default '',
  bio text not null default '',
  contact_email text not null default '',
  phone text not null default '',
  avatar_url text not null default '',
  github_url text not null default '',
  linkedin_url text not null default '',
  instagram_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id text primary key default 'main',
  hero_kicker text not null default '',
  hero_title text not null default '',
  hero_lede text not null default '',
  about_title text not null default '',
  about_text_one text not null default '',
  about_text_two text not null default '',
  process_title text not null default '',
  process_text text not null default '',
  contact_title text not null default '',
  contact_text text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.company_profile enable row level security;
alter table public.developer_profile enable row level security;
alter table public.site_content enable row level security;

grant select on public.company_profile, public.developer_profile, public.site_content to anon, authenticated;
grant insert, update, delete on public.company_profile, public.developer_profile, public.site_content to authenticated;

drop policy if exists "public can read company profile" on public.company_profile;
drop policy if exists "admins can manage company profile" on public.company_profile;
drop policy if exists "public can read developer profile" on public.developer_profile;
drop policy if exists "admins can manage developer profile" on public.developer_profile;
drop policy if exists "public can read site content" on public.site_content;
drop policy if exists "admins can manage site content" on public.site_content;

create policy "public can read company profile" on public.company_profile for select to anon, authenticated using (id = 'main');
create policy "admins can manage company profile" on public.company_profile for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "public can read developer profile" on public.developer_profile for select to anon, authenticated using (id = 'main');
create policy "admins can manage developer profile" on public.developer_profile for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "public can read site content" on public.site_content for select to anon, authenticated using (id = 'main');
create policy "admins can manage site content" on public.site_content for all to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

insert into public.company_profile (id, contact_email, instagram_url, linkedin_url)
values ('main', 'contato@enpiricos.com.br', '', '') on conflict (id) do nothing;

insert into public.developer_profile (id, full_name, role, contact_email, github_url)
values ('main', 'Eliseu Rodrigues Guimarães Costa', 'Engenheiro de software', 'eliseu.guimaraes@rizzonet.com.br', 'https://github.com/enpiricos') on conflict (id) do nothing;

insert into public.site_content (id, hero_kicker, hero_title, hero_lede, about_title, about_text_one, about_text_two, process_title, process_text, contact_title, contact_text)
values ('main', 'Engenheiro de software · Rio de Janeiro', 'Ideias fortes merecem tecnologia.', 'Eu construo produtos digitais que conectam estratégia, engenharia e pessoas.', 'Engenharia com visão de produto.', 'Sou Eliseu, engenheiro de software. Trabalho na interseção entre tecnologia, produto e pessoas para transformar problemas complexos em experiências simples.', 'Do primeiro esboço ao deploy, penso em sistemas que fazem sentido para quem usa e para quem mantém. Código é ferramenta; impacto é o objetivo.', 'Clareza antes do código.', 'Um processo simples para transformar problemas complexos em produtos que funcionam.', 'Tem uma ideia? Vamos tirar do papel.', 'Conte o que você está construindo e vamos pensar juntos nos próximos passos.') on conflict (id) do nothing;

-- Optional one-time migration from the original mixed profile table.
update public.developer_profile d set full_name = p.full_name, role = p.role, bio = p.bio, contact_email = p.contact_email, phone = p.phone, avatar_url = p.avatar_url, github_url = p.github_url, linkedin_url = p.linkedin_url, instagram_url = p.instagram_url from public.site_profile p where p.id = 'main' and d.id = 'main';
update public.company_profile c set cnpj = p.cnpj, address = p.address, contact_email = case when p.contact_email like '%@rizzonet%' then c.contact_email else p.contact_email end, phone = p.phone from public.site_profile p where p.id = 'main' and c.id = 'main';
update public.site_content s set hero_kicker = p.hero_kicker, hero_title = p.hero_title, hero_lede = p.hero_lede, about_title = p.about_title, about_text_one = p.about_text_one, about_text_two = p.about_text_two, process_title = p.process_title, process_text = p.process_text, contact_title = p.contact_title, contact_text = p.contact_text from public.site_profile p where p.id = 'main' and s.id = 'main';

notify pgrst, 'reload schema';
