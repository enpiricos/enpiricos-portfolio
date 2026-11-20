import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Check, Code2, Mail, Menu, X } from "lucide-react";
import "./styles.css";
import AdminApp from "./admin";
import { supabase } from "./lib/supabase";

type Project = { number: string; title: string; eyebrow: string; description: string; stack: string; href: string; tone: "blue" | "black" | "white" };
type Profile = { full_name: string; role: string; bio: string; contact_email: string; phone: string; address: string; cnpj: string; github_url: string; linkedin_url: string; instagram_url: string; avatar_url: string; hero_kicker: string; hero_title: string; hero_lede: string; about_title: string; about_text_one: string; about_text_two: string; process_title: string; process_text: string; contact_title: string; contact_text: string };
type Tool = { id: string; name: string; category: string; icon: string; sort_order: number };

const fallbackProjects: Project[] = [
  { number: "01", title: "ItaZoo", eyebrow: "Patrimônio & ciência", description: "Portal científico e repositório paleontológico 3D da Bacia de São José de Itaboraí.", stack: "React · TanStack Start · Three.js", href: "https://itazoo.enpiricos.com.br", tone: "blue" },
  { number: "02", title: "Monetos", eyebrow: "Produto financeiro", description: "Uma experiência digital para transformar dados financeiros em decisões melhores.", stack: "React · TypeScript · Supabase", href: "https://monetos.enpiricos.com.br", tone: "black" },
  { number: "03", title: "Sob medida", eyebrow: "Consultoria & produto", description: "Sistemas digitais pensados para simplificar operações e gerar resultado.", stack: "Arquitetura · APIs · Cloud", href: "mailto:eliseu.guimaraes@rizzonet.com.br?subject=Vamos conversar", tone: "white" },
];

const fallbackProfile: Profile = {
  full_name: "Eliseu Rodrigues Guimarães Costa", role: "Engenheiro de software", bio: "", contact_email: "eliseu.guimaraes@rizzonet.com.br", phone: "", address: "", cnpj: "", github_url: "https://github.com/enpiricos", linkedin_url: "", instagram_url: "", avatar_url: "", hero_kicker: "Engenheiro de software · Rio de Janeiro", hero_title: "Ideias fortes merecem tecnologia.", hero_lede: "Eu construo produtos digitais que conectam estratégia, engenharia e pessoas.", about_title: "Engenharia com visão de produto.", about_text_one: "Sou Eliseu, engenheiro de software. Trabalho na interseção entre tecnologia, produto e pessoas para transformar problemas complexos em experiências simples.", about_text_two: "Do primeiro esboço ao deploy, penso em sistemas que fazem sentido para quem usa e para quem mantém. Código é ferramenta; impacto é o objetivo.", process_title: "Clareza antes do código.", process_text: "Um processo simples para transformar problemas complexos em produtos que funcionam.", contact_title: "Tem uma ideia? Vamos tirar do papel.", contact_text: "Conte o que você está construindo e vamos pensar juntos nos próximos passos.",
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [tools, setTools] = useState<Tool[]>([]);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from("site_profile").select("*").eq("id", "main").maybeSingle(),
      supabase.from("projects").select("title, eyebrow, description, stack, href, tone, sort_order").eq("is_published", true).order("sort_order", { ascending: true }),
      supabase.from("tools").select("id, name, category, icon, sort_order").eq("is_published", true).order("sort_order", { ascending: true }),
    ]).then(([profileResult, projectResult, toolsResult]) => {
      if (profileResult.data) setProfile({ ...fallbackProfile, ...profileResult.data });
      if (projectResult.data?.length) setProjects(projectResult.data.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") })) as Project[]);
      if (toolsResult.data) setTools(toolsResult.data as Tool[]);
    });
  }, []);

  const socials = [
    profile.github_url && { href: profile.github_url, label: "GitHub", icon: <Code2 size={18} /> },
    profile.linkedin_url && { href: profile.linkedin_url, label: "LinkedIn", icon: <BriefcaseBusiness size={18} /> },
    profile.instagram_url && { href: profile.instagram_url, label: "Instagram", icon: <span className="social-letter">ig</span> },
    profile.contact_email && { href: `mailto:${profile.contact_email}`, label: "E-mail", icon: <Mail size={18} /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return <div className="site-shell">
    <header className="topbar"><a className="brand" href="#top" aria-label="Enpiricos — início"><img src="/brand/enpiricos-logo.svg" alt="enpiricos" /></a><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button><nav className={menuOpen ? "nav-links open" : "nav-links"}><a href="#sobre" onClick={closeMenu}>Sobre</a><a href="#projetos" onClick={closeMenu}>Projetos</a><a href="#processo" onClick={closeMenu}>Processo</a><a className="nav-cta" href="#contato" onClick={closeMenu}>Vamos conversar <ArrowUpRight size={16} /></a></nav></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="pulse" /> {profile.hero_kicker}</p><h1>{profile.hero_title.split(" ").slice(0, 2).join(" ")}<br /><span>{profile.hero_title.split(" ").slice(2, 4).join(" ")}</span><br />{profile.hero_title.split(" ").slice(4).join(" ")}</h1><p className="hero-lede">{profile.hero_lede}</p><div className="hero-actions"><a className="button button-blue" href="#projetos">Conheça meus projetos <ArrowUpRight size={17} /></a><a className="quiet-link" href="#sobre">Sobre mim <ArrowDownRight size={17} /></a></div></div><div className="hero-panel" aria-label="Enpiricos — tecnologia com propósito"><img src="/brand/enpiricos-logo-branca.svg" alt="enpiricos" className="hero-logo" /><div className="panel-grid" />{profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="developer-photo" /> : <div className="panel-symbol"><img src="/brand/enpiricos-simbolo.svg" alt="" /></div>}<div className="panel-caption"><span>01</span><span>ideia → impacto</span></div></div></section>
      <div className="brand-line"><span>enpiricos</span><span className="line" /><span>software com propósito</span><span className="brand-dot">✳</span><span>tecnologia que resolve</span></div>
      {tools.length > 0 && <div className="tools-marquee"><div className="tools-track">{[...tools, ...tools].map((tool, index) => <span key={`${tool.id}-${index}`}><b>{tool.icon}</b>{tool.name}</span>)}</div></div>}
      <section id="sobre" className="about page-section"><div className="section-kicker">/ 01 — sobre</div><div className="about-content"><h2>{profile.about_title.split(" ").slice(0, 2).join(" ")}<br /><span>{profile.about_title.split(" ").slice(2).join(" ")}</span></h2><div className="about-body"><p>{profile.about_text_one}</p><p>{profile.about_text_two}</p></div><div className="skill-list"><span><Check size={15} /> Produto digital</span><span><Check size={15} /> Arquitetura</span><span><Check size={15} /> Experiências web</span></div></div></section>
      <section id="projetos" className="projects page-section"><div className="section-kicker">/ 02 — projetos</div><div className="projects-content"><div className="section-intro"><h2>Feito para<br /><span>funcionar.</span></h2><p>Alguns projetos que mostram como penso, construo e entrego.</p></div><div className="project-list">{projects.map((project) => <a className={`project-card ${project.tone}`} href={project.href} key={project.number} target={project.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><div className="project-top"><span>{project.number}</span><span>{project.eyebrow}</span></div><div className="project-title"><h3>{project.title}</h3><ArrowUpRight size={26} /></div><p>{project.description}</p><span className="project-stack">{project.stack}</span></a>)}</div></div></section>
      <section id="processo" className="process page-section"><div className="section-kicker">/ 03 — processo</div><div className="process-content"><h2>{profile.process_title}</h2><p className="process-intro">{profile.process_text}</p><div className="process-steps"><div><b>01</b><h3>Entender</h3><p>O problema, o contexto e as pessoas envolvidas.</p></div><div><b>02</b><h3>Construir</h3><p>Uma solução sólida, bonita e possível de evoluir.</p></div><div><b>03</b><h3>Entregar</h3><p>Produto no mundo, aprendendo com quem usa.</p></div></div></div></section>
      <section id="contato" className="contact page-section"><div className="section-kicker">/ 04 — contato</div><div className="contact-content"><img src="/brand/enpiricos-logo-branca.svg" alt="enpiricos" className="contact-logo" /><h2>{profile.contact_title}</h2><p className="contact-copy">{profile.contact_text}</p><div className="contact-details">{profile.address && <span>{profile.address}</span>}{profile.cnpj && <span>CNPJ {profile.cnpj}</span>}</div><a className="contact-email" href={`mailto:${profile.contact_email}`}>{profile.contact_email} <ArrowUpRight size={21} /></a></div></section>
    </main>
    <footer className="footer"><span>© 2026 enpiricos</span><span>Feito com curiosidade e código.</span><div className="socials">{socials.map((social) => <a href={social.href} aria-label={social.label} key={social.label} target={social.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{social.icon}</a>)}</div></footer>
  </div>;
}

const root = createRoot(document.getElementById("root")!);
if (window.location.pathname === "/admin") root.render(<AdminApp />); else root.render(<App />);
