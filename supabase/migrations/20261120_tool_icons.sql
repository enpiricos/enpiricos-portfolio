alter table public.tools add column if not exists icon_name text not null default 'Code2';
alter table public.tools add column if not exists icon_url text not null default '';

notify pgrst, 'reload schema';
