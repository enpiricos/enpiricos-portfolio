update public.site_content
set hero_kicker = ''
where id = 'main' and hero_kicker ilike '%Engenheiro de software%';

notify pgrst, 'reload schema';
