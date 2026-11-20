alter table public.projects add column if not exists logo_url text not null default '';
notify pgrst, 'reload schema';
